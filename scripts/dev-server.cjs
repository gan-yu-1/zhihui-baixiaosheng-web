const { spawn } = require('node:child_process')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const nextBin = path.join(root, 'node_modules', 'next', 'dist', 'bin', 'next')
const forwardedArgs = []

for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index]
  if (arg === '--host') {
    forwardedArgs.push('--hostname')
  }
  else if (arg.startsWith('--host=')) {
    forwardedArgs.push(`--hostname=${arg.slice('--host='.length)}`)
  }
  else {
    forwardedArgs.push(arg)
  }
}

const systemCaArgs = process.allowedNodeEnvironmentFlags.has('--use-system-ca') ? ['--use-system-ca'] : []
const child = spawn(process.execPath, [...systemCaArgs, nextBin, 'dev', ...forwardedArgs], {
  cwd: root,
  env: process.env,
  stdio: 'inherit',
  shell: false,
})

child.on('error', (error) => {
  console.error('Unable to start Next.js:', error)
  process.exitCode = 1
})
child.on('exit', (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}
