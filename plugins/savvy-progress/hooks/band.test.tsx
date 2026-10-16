import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On } from 'claude-code'

const BAND = { component: 'AbovePrompt', props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100 } as never } as const

async function session($: Engine, on: On) {
  mock.clock(on, { now: Date.parse('2026-10-10T02:00:00Z') })
  mock.env(on, { LANG: 'en_US.UTF-8' })
  on('settings.read', async () => ({ value: {} }) as never)
  on('session.start', async () => ({ cwd: '/repo' }) as never)
  await $.session.start({ source: 'startup', cwd: '/repo', surface: 'terminal', isInteractive: true } as never)
  await $.tool.call({ tool: 'mcp__savvy-progress__progress', title: 'Ship it', total: 4, done: 1, phase: 'delegate' } as never)
}

async function band($: Engine, surface: 'terminal' | 'desktop') {
  const ui = await $.ui.mount({ plugin: 'savvy-progress', surface, ...BAND })
  const svg = await ui.findAll({ type: 'Svg' })
  const title = await ui.findAll({ type: 'Text', text: /^Ship it$/ })
  const label = await ui.findAll({ type: 'Text', text: /^Tasks 1\/4$/ })
  await ui.unmount()
  return { svg: svg.length, title: title.length, label: label.length }
}

test('terminal: the row draws the title, bar and label as text, not an Svg', async ($, on) => {
  await session($, on)
  expect(await band($, 'terminal')).toEqual({ svg: 0, title: 1, label: 1 })
})

test('desktop: the row is still one Svg', async ($, on) => {
  await session($, on)
  expect(await band($, 'desktop')).toEqual({ svg: 1, title: 0, label: 0 })
})

for (const [cols, full] of [[30, false], [100, true]] as const) {
  test(`desktop: a ${cols}-column row draws nothing past its width`, async ($, on) => {
    await session($, on)
    const ui = await $.ui.mount({ plugin: 'savvy-progress', surface: 'desktop', ...BAND, props: { ...BAND.props, bodyColumns: cols } as never })
    const src = String((await ui.find({ type: 'Svg' }))?.props.source)
    await ui.unmount()
    const num = (re: RegExp) => Number(src.match(re)?.[1])
    // The bar, then 46px for the percent, ends inside the row.
    expect(num(/translate\(([\d.]+),/) + num(/<rect class="k" width="([\d.]+)"/) + 46 <= num(/^<svg[^>]* width="(\d+)"/)).toBe(true)
    // The pill and the crab show only where they fit.
    expect(src.includes('>Tasks 1/4</text>')).toBe(full)
    expect(src.includes('@keyframes wave')).toBe(full)
  })
}