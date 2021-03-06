import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import HospitalRunVersion from 'hospitalrun/mixins/hospitalrun-version';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import UserSession from 'hospitalrun/mixins/user-session';
import Navigation from 'hospitalrun/mixins/navigation';

export default Component.extend(HospitalRunVersion, ModalHelper, UserSession, Navigation, {
  ajax: service(),
  allowSearch: false,
  config: service(),
  intl: service(),
  progressTitle: 'Searching',
  router: service(),
  session: service(),
  syncStatus: '',
  currentOpenNav: null,
  selectedLanguage: null,

  actions: {
    about() {
      let version = this.get('version');
      this.get('ajax').request('/serverinfo').then((siteInfo) => {
        let message = `Version: ${version}`;
        if (!isEmpty(siteInfo)) {
          message += ` Site Info: ${siteInfo}`;
        }
        this.displayAlert(this.get('intl').t('navigation.about'), message);
      });
    },

    invalidateSession() {
      let session = this.get('session');
      if (session.get('isAuthenticated')) {
        session.invalidate().catch(() => {
          let intl = this.get('intl');
          let message = intl.t('navigation.messages.logoutFailed');
          let title = intl.t('navigation.titles.logoutFailed');
          this.displayAlert(title, message);
        });
      }
    },

    search() {
      this.sendAction('search', this.get('searchText'));
      this.set('searchText', '');
    },

    navAction(nav) {
      if (this.currentOpenNav && this.currentOpenNav.route !== nav.route) {
        this.currentOpenNav.closeSubnav();
      }
      this.set('currentOpenNav', nav);

      this.get('router').transitionTo(nav.route);
      this.set('isShowingSettings', false);
    },

    toggleSettings() {
      this.toggleProperty('isShowingSettings');
    },

    closeSettings() {
      this.set('isShowingSettings', false);
    }
  }
});

