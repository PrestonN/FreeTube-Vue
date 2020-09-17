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
    this.updateWebdavServerUrlBounce = debounce(this.updateWebdavServerUrl, 500)
    this.updateWebdavServerDirBounce = debounce(this.updateWebdavServerDir, 500)
    this.updateWebdavUsernameBounce = debounce(this.updateWebdavUsername, 500)
    this.updateWebdavPasswordBounce = debounce(this.updateWebdavPassword, 500)
    // this.currentSyncStrategy = localStorage.getItem('syncStrategy')
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

    triggerSync: function() {
      // await freeTubeCfgSync.sync()
    },

    /*updateSyncStrategy: function (strategy) {

      const payload = {
        syncStrategy: strategy
      }

      this.$parent.$parent.syncStrategy(payload)
      this.currentSyncStrategy = strategy
    },*/

    /*updateSyncStrategy: function (syncStrategy) {
      this.currentSyncStrategy = syncStrategy
      localStorage.setItem('syncStrategy', syncStrategy)
    },*/

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
      'updateWebdavDigestAuth'
    ])
  }
})
