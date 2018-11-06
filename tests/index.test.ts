import path from 'path'
import Toolkit from '../src'

describe('Toolkit', () => {
  let toolkit: Toolkit

  beforeEach(() => {
    toolkit = new Toolkit()
  })

  describe('#createOctokit', () => {
    it('returns an Octokit client', () => {
      const actual = toolkit.createOctokit()
      expect(actual).not.toBe(null)
      expect(actual).toBeInstanceOf(Object)
    })

    it('throws if there is no GITHUB_TOKEN environment variable', () => {
      toolkit.token = ''
      expect(() => toolkit.createOctokit()).toThrowErrorMatchingSnapshot()
    })
  })

  describe('#getFile', () => {
    it('gets the contents of a file', () => {
      const actual = toolkit.getFile('README.md')
      expect(actual).toMatchSnapshot()
    })

    it('throws if the file could not be found', () => {
      const actual = () => toolkit.getFile('DONTREADME.md')
      expect(actual).toThrowErrorMatchingSnapshot()
    })
  })

  describe('#getPackageJSON', () => {
    it('returns the package.json file as a JSON object', () => {
      const actual = toolkit.getPackageJSON()
      expect(actual).toMatchSnapshot()
    })

    it('throws if the package.json file could not be found', () => {
      toolkit.workspace = path.join(__dirname, 'fixtures', 'workspaces', 'no-package-json')
      const actual = () => toolkit.getPackageJSON()
      expect(actual).toThrowErrorMatchingSnapshot()
    })
  })

  describe('#config', () => {
    it('returns a property in the package.json', () => {
      const actual = toolkit.config('action')
      expect(actual).toEqual({ foo: true })
    })

    it('returns a parsed YAML file', () => {
      const actual = toolkit.config('action.yml')
      expect(actual).toEqual({ foo: true })
    })

    it('returns a .rc file as JSON', () => {
      const actual = toolkit.config('.actionrc')
      expect(actual).toEqual({ foo: true })
    })
  })

  describe('#runInWorkspace', () => {
    it('runs the command in the workspace', async () => {
      const result = await toolkit.runInWorkspace('echo', 'hello')
      expect(result).toMatchSnapshot()
      expect(result.stdout).toBe('hello')
    })
  })

  describe('#warnForMissingEnvVars', () => {
    it('logs the expected string', () => {
      delete process.env.HOME
      // Toolkit, but number two. Ergo, twolkit. Open an issue if this isn't clear.
      const twolkit = new Toolkit()

      expect(twolkit.warning).toMatchSnapshot()
    })
  })
})
