/**
 *   Wechaty Open Source Software - https://github.com/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import { WechatyBuilder } from '@juzi/wechaty'
import { Ducks }   from 'ducks'
import {
  WechatyRedux,
  Duck,
}                 from '../src/mod.js' // 'wechaty-redux'

async function main () {
  /**
   * 1. Ducksify Wechaty Redux API
   */
  const ducks = new Ducks({ wechaty: Duck })
  const store = ducks.configureStore()

  /**
   * 2. Instantiate Wechaty with Redux Plugin
   */
  const bot = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  bot.use(WechatyRedux({ store }))

  /**
   * 3. Using Redux Store with Wechaty Ducks API!
   *  (With the Power of Ducks / Ducksify)
   */
  const wechatyDuck = ducks.ducksify('wechaty')

  store.subscribe(() => console.info((store.getState() as any)['ducks']))

  await bot.start()
  console.info('Wechaty has started with Redux enabled.')

  void wechatyDuck
  // wechatyDuck.operations.ding(bot.puppet.id, 'Ducksify Style ding!')

  await bot.stop()
  console.info('Ducks Proposal Example finished.')
}

main()
  .catch(console.error)
