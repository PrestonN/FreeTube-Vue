import Vue from 'vue'
import { mapActions } from 'vuex'
import FtCard from '../ft-card/ft-card.vue'
import FtButton from '../../components/ft-button/ft-button.vue'
import FtSelect from '../ft-select/ft-select.vue'
import FtInput from '../ft-input/ft-input.vue'
import FtToggleSwitch from '../ft-toggle-switch/ft-toggle-switch.vue'
import FtFlexBox from '../ft-flex-box/ft-flex-box.vue'

import debounce from 'lodash.debounce'

export default Vue.extend({
  name: 'SyncSettings',
  components: {
    'ft-card': FtCard,
    'ft-button': FtButton,
    'ft-select': FtSelect,
    'ft-input': FtInput,
    'ft-toggle-switch': FtToggleSwitch,
    'ft-flex-box': FtFlexBox
  },
  data: function () {
    return {
      /*defaultSyncSubscriptions: false,
      defaultSyncHistory: false,
      defaultSyncSettings: false,
      defaultSyncPreferences: false,
      defaultAutoSync: false,
      defaultWebdavDigestAuth: false,
      defaultSyncStrategy: 'overwrite_older',
      defaultWebdavDir: '/FreeTube/',*/
      syncStrategyValues: [
        'overwrite_older',
        'overwrite_remote',
        'overwrite_local'
      ]
    }
  },
  computed: {

    syncSubscriptions: function () {
      return this.$store.getters.getSyncSubscriptions
    },

    syncHistory: function () {
      return this.$store.getters.getSyncHistory
    },

    syncSettings: function () {
      return this.$store.getters.getSyncSettings
    },

    syncPreferences: function () {
      return this.$store.getters.getSyncPreferences
    },

    autoSync: function () {
      return this.$store.getters.getAutoSync
    },

    syncStrategy: function () {
      return this.$store.getters.getSyncStrategy
    },

    webdavServerUrl: function () {
      return this.$store.getters.getWebdavServerUrl
    },

    webdavServerDir: function () {
      return this.$store.getters.getWebdavServerDir
    },

    webdavUsername: function () {
      return this.$store.getters.getWebdavUsername
    },

    webdavPassword: function () {
      return this.$store.getters.getWebdavPassword
    },

    webdavDigestAuth: function () {
      return this.$store.getters.getWebdavDigestAuth
    },

    syncStrategyNames: function () {
      return [
        this.$t('Settings.Sync Settings.Sync Strategy.overwrite_older'),
        this.$t('Settings.Sync Settings.Sync Strategy.overwrite_remote'),
        this.$t('Settings.Sync Settings.Sync Strategy.overwrite_local')
      ]
    }

  },
  mounted: function () {

    this.updateWebdavServerUrlBounce = debounce(webdavServerUrl => {
      this.setWebdavServerUrl(webdavServerUrl)
      this.updateWebdavServerUrl(webdavServerUrl)
    }, 500)

    this.updateWebdavServerDirBounce = debounce(webdavServerDir => {
      this.setWebdavServerDir(webdavServerUrl)
      this.updateWebdavServerDir(webdavServerDir)
    }, 500)

    this.updateWebdavUsernameBounce = debounce(webdavUsername => {
      this.setWebdavUsername(webdavUsername)
      this.updateWebdavUsername(webdavUsername)
    }, 500)

    this.updateWebdavPasswordBounce = debounce(webdavPassword => {
      this.setWebdavPassword(webdavPassword)
      this.updateWebdavPassword(webdavPassword)
    }, 500)

    this.setWebdavServerUrl(this.webdavServerUrl)
    this.setWebdavServerDir(this.webdavServerDir)
    this.setWebdavUsername(this.webdavUsername)
    this.setWebdavPassword(this.webdavPassword)
    this.setSyncSubscriptions(this.syncSubscriptions)
    this.setSyncHistory(this.syncHistory)
    this.setSyncSettings(this.syncSettings)
    this.setSyncPreferences(this.syncPreferences)
    this.setWebdavDigestAuth(this.webdavDigestAuth)
    this.setAutoSync(this.autoSync)
    this.setSyncStrategy(this.syncStrategy)

  },
  methods: {

    handleWebdavServerUrlInput: function (input) {
      const webdavServerUrl = input.replace(/\/$/, '')
      this.updateWebdavServerUrlBounce(webdavServerUrl)
    },
    handleWebdavServerDirInput: function (input) {
      const webdavServerDir = input.replace(/\/$/, '')
      this.updateWebdavServerDirBounce(webdavServerDir)
    },
    handleWebdavUsernameInput: function (input) {
      const webdavUsername = input
      this.updateWebdavUsernameBounce(webdavUsername)
    },
    handleWebdavPasswordInput: function (input) {
      const webdavPassword = input
      this.updateWebdavPasswordBounce(webdavPassword)
    },
    handleSyncSubscriptionsChange: function (input) {
      this.setSyncSubscriptions(input)
      this.updateSyncSubscriptions(input)
    },
    handleSyncSettingsChange: function (input) {
      this.setSyncSettings(input)
      this.updateSyncSettings(input)
    },
    handleSyncHistoryChange: function (input) {
      this.setSyncHistory(input)
      this.updateSyncHistory(input)
    },
    handleSyncPreferencesChange: function (input) {
      this.setSyncPreferences(input)
      this.updateSyncPreferences(input)
    },
    handleWebdavDigestAuthChange: function (input) {
      this.setWebdavDigestAuth(input)
      this.updateWebdavDigestAuth(input)
    },
    handleAutoSyncChange: function (input) {
      this.setAutoSync(input)
      this.updateAutoSync(input)
    },
    handleSyncStrategyChange: function (input) {
      this.setSyncStrategy(input)
      this.updateSyncStrategy(input)
    },

    triggerSync: async function() {
      await sync()
    },


    ...mapActions([
      'updateSyncSubscriptions',
      'updateSyncHistory',
      'updateSyncSettings',
      'updateSyncPreferences',
      'updateAutoSync',
      'updateSyncStrategy',
      'updateWebdavServerUrl',
      'updateWebdavServerDir',
      'updateWebdavUsername',
      'updateWebdavPassword',
      'updateWebdavDigestAuth',
      'setWebdavDigestAuth',
      'setWebdavServerUrl',
      'setWebdavServerDir',
      'setWebdavUsername',
      'setWebdavPassword',
      'setWebdavDigestAuth',
      'setRemoteDir',
      'addSyncType',
      'removeSyncType',
      'setSyncStrategy',
      'sync'
    ])
  }
})
