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
    subtextMessage: PropTypes.string,
    messageClassName: PropTypes.string,
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
    const isClickable = (this.props.clickHandler !== undefined) || (this.props.href !== undefined)
    let itemStyle = ''
    if (!this.props.isHeader) {
      itemStyle = (isClickable ? ' menu-item-clickable' : ' menu-item-plain')
    }
    return (
      <li className={'menu-list-item' + itemStyle}>
        {this.props.messageId &&
          <a {...linkParams} className={this.props.isHeader ? 'menu-header' : ''}>
            {this.props.icon !== undefined &&
              <Icon icon={this.props.icon} />
            }
            <FormattedMessage id={this.props.messageId} defaultMessage={this.props.defaultMessage}
              className={this.props.messageClassName} />
            {this.props.subtextMessage &&
              <span className="menu-item-subtext">
                <FormattedMessage id={this.props.messageId + '-byline'} defaultMessage={this.props.subtextMessage} />
              </span>
            }
          </a>
        }
        {this.props.children}
      </li>
    )
  }
}
