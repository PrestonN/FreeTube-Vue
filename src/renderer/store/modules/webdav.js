import { createClient } from 'webdav'
import { promises as fs } from 'fs'
import electron from 'electron'

const fileMap = {
  'subscriptions': 'profiles.db',
  'history': 'history.db',
  'settings': 'settings.db',
  'preferences': 'Preferences'
}

const state = {
  localDir: electron.remote.app.getPath('userData'),

   // TODO: load values from settings
  remoteDir: '',
  filesToSync: [],
  strategy: 'overwrite_older',
  fileAgeTolerance: 5000,
  webdav: {
    url: '',
    username: '',
    password: '',
    digest: true
  },
  client: null
}


// Functions that don't get exposed
function login() {
  if (state.webdav.url && state.webdav.username && state.webdav.password) {
    state.client = createClient(state.webdav.url, {
      username: state.webdav.username,
      password: state.webdav.password,
      digest: state.webdav.digest
    })
  }
}
login() // Call immediately so that we are logged in case the settings had been saved already
async function syncOverwriteRemote() {
  for (const fileName of state.filesToSync) {
    const fileBuffer = await fs.readFile(`${state.localDir}/${fileName}`)
    await state.client.putFileContents(`${state.remoteDir}/${fileName}`, fileBuffer, { overwrite: true })
    // console.log(`Synchronized ${fileName} from local to remote.`)
  }
}
async function syncOverwriteLocal() {
  for (const fileName of state.filesToSync) {
    const fileBuffer = await state.client.getFileContents(`${state.remoteDir}/${fileName}`)
    await fs.writeFile(`${state.localDir}/${fileName}`, fileBuffer)
    // console.log(`Synchronized ${fileName} from remote to local.`)
  }
}
async function syncOverwriteOlder() {
  for (const fileName of state.filesToSync) {
    let lastModifiedLocal
    try {
      const localStats = await fs.stat(`${state.localDir}/${fileName}`)
      lastModifiedLocal = parseInt((new Date(localStats.mtime)).getTime())
    } catch (err) {
      if(err.code === 'ENOENT') { // file doesn't exist
        lastModifiedLocal = 0
      } else {
        throw err
      }
    }

    let lastModifiedRemote
    if (await state.client.exists(`${state.remoteDir}/${fileName}`) === false) {
      lastModifiedRemote = 0
    } else {
      const remoteStats = await state.client.stat(`${state.remoteDir}/${fileName}`)
      lastModifiedRemote = parseInt((new Date(remoteStats.lastmod)).getTime())
    }

    if (lastModifiedLocal > lastModifiedRemote+state.fileAgeTolerance) {
      await syncOverwriteRemote([fileName])
    } else if (lastModifiedRemote > lastModifiedLocal+state.fileAgeTolerance) {
      await syncOverwriteLocal([fileName])
    } else {
      // console.log(`Skipped ${fileName} beacuse local and remote are equal.`)
    }
  }
}

const actions = {
  setRemoteDir(remoteDir) {
    state.remoteDir = remoteDir
  },
  addSyncType(syncType) {
    const fileName = fileMap[syncType]
    if (typeof fileName !== 'undefined' && !state.filesToSync.includes(fileName))
      state.filesToSync.push(fileName)
  },
  removeSyncType(syncType) {
    const fileName = fileMap[syncType]
    if (typeof fileName !== 'undefined' && state.filesToSync.includes(fileName))
      delete state.filesToSync[fileName]
  },
  setSyncStrategy(syncStrategy) {
    state.syncStrategy = syncStrategy
  },
  setWebdavServerUrl(webdavServerUrl) {
    state.webdav.url = webdavServerUrl
    login()
  },
  setWebdavUsername(webdavUsername) {
    state.webdav.username = webdavUsername
    login()
  },
  setWebdavPassword(webdavPassword) {
    state.webdav.password = webdavPassword
    login()
  },
  setWebdavDigestAuth(digestAuthState) {
    state.webdav.digest = digestAuthState
    login()
  },
  async sync() {
    if (state.client) {
      if (await state.client.exists(state.remoteDir) === false) {
        await state.client.createDirectory(state.remoteDir)
      }
      if (state.state === 'overwrite_older') {
        await syncOverwriteOlder()
      } else if (state.strategy === 'overwrite_remote') {
        await syncOverwriteRemote()
      } else if (state.strategy === 'overwrite_local') {
        await syncOverwriteLocal()
      }
    } else {
      console.error(new Error('Username, password or url are missing...'))
    }
  }
}

export default {
  state,
  getters: {},
  actions,
  mutations: {}
}
