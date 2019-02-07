import React from 'react'
import { FormattedMessage, injectIntl, intlShape } from 'react-intl'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from './Menu'
import MenuListItem from './MenuListItem'

import { FACEBOOK_APP_ID } from '../app/config'
import { trackEvent } from '../app/event_tracking'
import { getPageTitle } from '../app/page_title'
import { getSharingUrl } from '../util/share_url'

import { showDialog } from '../store/actions/dialogs'
import { startPrinting } from '../store/actions/app'

import './ShareMenu.scss'

class ShareMenu extends React.Component {
  static propTypes = {
    intl: intlShape,
    showDialog: PropTypes.func,
    startPrinting: PropTypes.func,
    signedIn: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    street: PropTypes.object
  }

  static defaultProps = {
    userId: ''
  }

  constructor (props) {
    super(props)

    this.state = {
      shareUrl: ''
    }
  }

  componentDidMount () {
    this.updateLinks()
  }

  updateLinks = () => {
    const url = getSharingUrl()

    this.setState({ shareUrl: url })
  }

  getSharingMessage = () => {
    const street = this.props.street
    let message = ''

    if (street.creatorId) {
      if (this.props.signedIn && street.creatorId === this.props.userId) {
        if (street.name) {
          message = this.formatSharingMessage('menu.share.messages.my-street', 'Check out my street, {streetName}, on Streetmix!', { streetName: street.name })
        } else {
          message = this.formatSharingMessage('menu.share.messages.my-street-unnamed', 'Check out my street on Streetmix!')
        }
      } else {
        if (street.name) {
          message = this.formatSharingMessage('menu.share.messages.someone-elses-street', 'Check out {streetName} by {streetCreator} on Streetmix!', { streetName: street.name, streetCreator: `@${street.creatorId}` })
        } else {
          message = this.formatSharingMessage('menu.share.messages.someone-elses-street-unnamed', 'Check out this street by {streetCreator} on Streetmix!', { streetCreator: `@${street.creatorId}` })
        }
      }
    } else {
      if (street.name) {
        message = this.formatSharingMessage('menu.share.messages.anonymous-creator-street', 'Check out {streetName} on Streetmix!', { streetName: street.name })
      } else {
        message = this.formatSharingMessage('menu.share.messages.anonymous-creator-street-unnamed', 'Check out this street on Streetmix!')
      }
    }

    return message
  }

  /**
   * Wrapper around props.intl.formatMessage
   *
   * @param {string} key
   * @param {string} defaultMsg - default message (fallback)
   * @param {Object} values - object of values to replace
   * @returns {string}
   */
  formatSharingMessage = (key, defaultMsg, values = {}) => {
    return this.props.intl.formatMessage({
      id: key,
      defaultMessage: defaultMsg
    }, values)
  }

  onShow = () => {
    // Make sure links are updated when the menu is opened
    this.updateLinks()

    // Auto-focus and select link when share menu is active
    window.setTimeout(() => {
      this.shareViaLinkInput.focus()
      this.shareViaLinkInput.select()
    }, 200)
  }

  onClickShareViaTwitter () {
    trackEvent('SHARING', 'TWITTER', null, null, false)
  }

  onClickShareViaFacebook () {
    trackEvent('SHARING', 'FACEBOOK', null, null, false)
  }

  onClickSaveAsImage = (event) => {
    event.preventDefault()
    this.props.showDialog('SAVE_AS_IMAGE')
  }

  onClickSignIn = (event) => {
    event.preventDefault()
    this.props.showDialog('SIGN_IN')
  }

  onClickPrint = (event) => {
    event.preventDefault()

    // Manually dispatch printing state here. Workaround for Chrome bug where
    // calling window.print() programatically (even with a timeout) render a
    // blank image instead
    this.props.startPrinting()

    window.setTimeout(function () {
      window.print()
    }, 0)
  }

  render () {
    const shareText = this.getSharingMessage()
    const twitterLink = 'https://twitter.com/intent/tweet' +
      '?text=' + encodeURIComponent(shareText) +
      '&url=' + encodeURIComponent(this.state.shareUrl)

    const facebookLink = 'https://www.facebook.com/dialog/feed' +
      '?app_id=' + encodeURIComponent(FACEBOOK_APP_ID) +
      '&redirect_uri=' + encodeURIComponent(this.state.shareUrl) +
      '&link=' + encodeURIComponent(this.state.shareUrl) +
      '&name=' + encodeURIComponent(getPageTitle(this.props.street)) +
      '&description=' + encodeURIComponent(shareText)

    const signInLink = <a onClick={this.onClickSignIn} href="#">
      <FormattedMessage
        defaultMessage="Sign in"
        id="menu.share.sign-in-twitter-link"
      />
    </a>

    const signInPromo = (!this.props.signedIn)
      ? (
        <MenuListItem>
          <div className="share-sign-in-promo">
            <FormattedMessage
              id="menu.share.sign-in-link"
              defaultMessage={`{signInLink} for nicer links to your streets and your personal street gallery`}
              values={{
                signInLink
              }}
            />
          </div>
        </MenuListItem>
      ) : null

    return (
      <Menu onShow={this.onShow} className="share-menu" {...this.props}>
        <ul className="menu-item-group">
          {signInPromo}
          <MenuListItem>
            <div className="share-via-link-container">
              <FormattedMessage id="menu.share.link" defaultMessage="Copy and paste this link to share:" />
              <input
                className="share-via-link"
                type="text"
                value={this.state.shareUrl}
                spellCheck="false"
                ref={(ref) => { this.shareViaLinkInput = ref }}
                readOnly
              />
            </div>
          </MenuListItem>
          <MenuListItem href={twitterLink} icon="twitter" messageId="menu.share.twitter"
            defaultMessage="Share using Twitter" clickHandler={this.onClickShareViaTwitter} />
          <MenuListItem href={facebookLink} icon="facebook" messageId="menu.share.facebook"
            defaultMessage="Share using Facebook" clickHandler={this.onClickShareViaFacebook} />
          <MenuListItem messageId="menu.share.print"
            defaultMessage="Print…" clickHandler={this.onClickPrint} />
          <MenuListItem id="save-as-image" messageId="menu.share.save" clickHandler={this.onClickSaveAsImage}
            defaultMessage="Save as image…" subtextMessage="For including in a report, blog, etc." />
        </ul>
      </Menu>
    )
  }
}

// Inject Intl via a higher-order component provided by react-intl.
// Exported so that this component can be tested.
export const ShareMenuWithIntl = injectIntl(ShareMenu)

function mapStateToProps (state) {
  return {
    signedIn: state.user.signedIn,
    userId: state.user.signInData && state.user.signInData.userId,
    street: state.street
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showDialog: (type) => { dispatch(showDialog(type)) },
    startPrinting: () => { dispatch(startPrinting()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShareMenuWithIntl)
