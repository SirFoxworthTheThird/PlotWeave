import { describe, it, expect } from 'vitest'
import { describeLinked, describeLocaliseResult, hostOf } from '@/lib/localiseImages'

describe('hostOf', () => {
  it('names the site a picture comes from', () => {
    expect(hostOf('https://upload.wikimedia.org/wikipedia/commons/a/b.jpg')).toBe('upload.wikimedia.org')
  })

  it('does not throw on something that is not a URL', () => {
    // A stored `url` is validated on the way in, but a `.pwk` from elsewhere is
    // not this app's data and should not be able to break a summary line.
    expect(hostOf('not a url')).toBe('not a url')
  })
})

describe('describeLinked', () => {
  it('says so plainly when there is nothing to do', () => {
    expect(describeLinked([])).toContain('already saved on this device')
  })

  it('counts the pictures and the sites they come from', () => {
    const urls = [
      'https://a.example/1.jpg', 'https://a.example/2.jpg', 'https://b.example/3.jpg',
    ]
    expect(describeLinked(urls)).toBe(
      '3 pictures in this world are links to 2 sites on the web, fetched each time they are shown.')
  })

  it('agrees in number for one of each', () => {
    expect(describeLinked(['https://a.example/1.jpg']))
      .toBe('1 picture in this world are links to 1 site on the web, fetched each time they are shown.')
  })
})

describe('describeLocaliseResult', () => {
  it('reports a clean run without inventing a caveat', () => {
    const out = describeLocaliseResult({ saved: 12, failed: [], bytes: 3_000_000 })
    expect(out).toContain('Saved 12 pictures')
    expect(out).toContain('2.9 MB')
    expect(out).not.toContain('could not')
  })

  /*
    The half this exists for. A partial run must say so, and say where — a
    writer who thinks their world is portable when it is not is worse off than
    one who never pressed the button.
  */
  it('names the sites that refused, grouped, with the rest counted', () => {
    const out = describeLocaliseResult({
      saved: 4,
      bytes: 1024,
      failed: [
        { host: 'a.example', reason: 'cors' }, { host: 'a.example', reason: 'cors' },
        { host: 'b.example', reason: 'cors' },
        { host: 'c.example', reason: 'cors' },
        { host: 'd.example', reason: 'cors' },
        { host: 'e.example', reason: 'cors' },
      ],
    })
    expect(out).toContain('6 could not be copied')
    expect(out).toContain('a.example (2)')
    expect(out).toContain('and 2 other sites')
    // The reassurance is load-bearing: nothing was lost, they are still links.
    expect(out).toContain('still appear when you are online')
  })

  it('does not claim a saving when nothing was saved', () => {
    const out = describeLocaliseResult({ saved: 0, bytes: 0, failed: [{ host: 'a.example', reason: 'cors' }] })
    expect(out).toContain('No pictures could be saved')
    expect(out).not.toContain('Saved 0')
  })

  it('says there was nothing to do rather than reporting a triumph', () => {
    expect(describeLocaliseResult({ saved: 0, failed: [], bytes: 0 })).toBe('There was nothing to save.')
  })
})
