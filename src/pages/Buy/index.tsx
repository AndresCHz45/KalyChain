import React from 'react'
import { TYPE } from '../../theme'
import { AutoColumn, ColumnCenter } from '../../components/Column'
import { OutlineCard } from '../../components/Card'
import { AutoRow } from '../../components/Row'
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import { Wrapper } from '../../components/swap/styleds'


export default function Buy() {
  const { t } = useTranslation()

  return (
    <>
      <AppBody>
        <Wrapper id="swap-page">
          <ColumnCenter>
            <AutoColumn gap="10px">
              <OutlineCard>
                <TYPE.link fontSize={14} fontWeight={500} color={'primaryText2'}>
                  {t('buyPage.buyKlcInfo')}
                  <br />
                  {t('buyPage.privacyInfo')}
                </TYPE.link>
                <br />
                <AutoRow gap="3px" justify={'center'}>
                 
                </AutoRow>
              </OutlineCard>
            </AutoColumn>
          </ColumnCenter>
          <iframe 
            height="625" 
            title="AlchemyPay On/Off Ramp Widget"
            src="https://ramp.alchemypay.org/?apiKey=N30r7fEYwrE7e5qf&&network=BSC&crypto=USDT&fiat=USD" 
            style={{ 
              display: 'block', 
              width: '100%', 
              maxHeight: '625px', 
              maxWidth: '500px',
              border: 'none', // Add this line to remove the border
              borderRadius: '10px'
            }}
            allowTransparency={true}
            allowFullScreen={true} 
          >
          </iframe>
        </Wrapper>
      </AppBody>
      {/* <Footer /> */}
    </>
  )
}
