import React from 'react'
import { Text, Box } from '@kalycoinproject/components'
import { useTranslation } from 'react-i18next'
import { Wrapper, IconWrapper, Icon, Link } from './styled'
import Telegram from '../../assets/svg/social/telegram.svg'
import Twitter from '../../assets/svg/social/twitter.svg'
import Github from '../../assets/svg/social/github.svg'
import Discord from '../../assets/svg/social/discord.svg'

interface SocialMediaProps {
  collapsed: boolean
}

export default function SocialMedia({ collapsed }: SocialMediaProps) {
  const { t } = useTranslation()

  const socialLinks = [
    {
      link: 'https://twitter.com/KalyChain',
      icon: Twitter,
      title: 'Twitter'
    },
    {
      link: 'https://t.me/+yj8Ae9lNXmg1Yzkx',
      icon: Telegram,
      title: 'Telegram'
    },
    {
      link: 'https://github.com/kalycoinproject',
      icon: Github,
      title: 'Github'
    },
    {
      link: 'https://discord.gg/3CHQFKDZPy',
      icon: Discord,
      title: 'Discord'
    }
  ]

  return (
    <Wrapper>
      {!collapsed && (
        <Box textAlign="center">
          <Text fontSize={12} color="text4">
            {t('header.comeAndJoinUs')}
          </Text>
        </Box>
      )}

      <IconWrapper collapsed={collapsed}>
        {socialLinks.map((x, index) => {
          return (
            <Link key={index} href={x.link}>
              <Icon height={'16px'} src={x.icon} alt={x.title} />
            </Link>
          )
        })}
      </IconWrapper>
    </Wrapper>
  )
}
