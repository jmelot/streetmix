import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Menu from './Menu'
import { trackEvent } from '../app/event_tracking'
import { showDialog } from '../store/actions/dialogs'
import MenuListItem from './MenuListItem'

class ContactMenu extends React.PureComponent {
  static propTypes = {
    showMinecraftDialog: PropTypes.func
  }

  onClickGitHub () {
    trackEvent('INTERACTION', '[Contribute menu] GitHub link clicked', null, null, false)
  }

  render () {
    return (
      <Menu {...this.props}>
        <ul className="menu-item-group">
          <MenuListItem href="https://discord.gg/NsKmV3S" icon="discord" messageId="menu.contact.discord"
            defaultMessage="Join Discord chat" />
          <MenuListItem href="https://forums.streetmix.net/" icon="forums" messageId="menu.contact.forums"
            defaultMessage="Discuss on the forums" />
          <MenuListItem href="https://github.com/streetmix/streetmix/" icon="github" messageId="menu.contact.github"
            defaultMessage="View source code on GitHub" />
          <MenuListItem href="https://twitter.com/intent/tweet?text=@streetmix" icon="twitter"
            messageId="menu.contact.twitter" defaultMessage="Send a tweet to @streetmix" />
          <MenuListItem href="#" messageId="menu.contact.minecraft" defaultMessage="Play Minecraft with us!&lrm;"
            clickHandler={this.props.showMinecraftDialog} />
        </ul>
      </Menu>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    showMinecraftDialog: () => { dispatch(showDialog('MINECRAFT')) }
  }
}

export default connect(null, mapDispatchToProps)(ContactMenu)
