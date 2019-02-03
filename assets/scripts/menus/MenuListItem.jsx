import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../ui/Icon'
import { FormattedMessage } from 'react-intl'

export default class MenuListItem extends React.PureComponent {
  static propTypes = {
    href: PropTypes.string,
    clickHandler: PropTypes.func,
    icon: PropTypes.string,
    messageId: PropTypes.string,
    defaultMessage: PropTypes.string,
    children: PropTypes.node
  }

  render () {
    const linkParams = {}
    if (this.props.clickHandler === undefined) {
      linkParams['target'] = '_blank'
      linkParams['rel'] = 'noopener noreferrer'
      linkParams['href'] = this.props.href
    } else {
      linkParams['onClick'] = this.props.clickHandler
      linkParams['href'] = '#'
    }
    return (
      <li>
        <a {...linkParams}>
          {this.props.icon !== undefined &&
            <Icon icon={this.props.icon} />
          }
          <FormattedMessage id={this.props.messageId} defaultMessage={this.props.defaultMessage} />
        </a>
        {this.props.children}
      </li>
    )
  }
}
