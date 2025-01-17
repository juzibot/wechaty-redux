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
import {
  createStore,
  applyMiddleware,
}                           from 'redux'
import {
  createEpicMiddleware,
  combineEpics,
}                           from 'redux-observable'
import { WechatyBuilder }   from '@juzi/wechaty'

import {
  WechatyRedux,
  Duck,
}                           from '../src/mod.js'  // 'wechaty-redux'

async function main () {
  /**
  * 1. Configure Store with RxJS Epic Middleware for Wechaty Ducks API
  */
  const epicMiddleware = createEpicMiddleware()

  const origStore = createStore(
    Duck.default,
    applyMiddleware(epicMiddleware),
  )

  const store = {
    ...origStore,
    dispatch: (action: any) => {
      console.info('action:', action)
      return origStore.dispatch(action)
    },
  }

  const rootEpic = combineEpics(...Object.values(Duck.epics) as any)
  epicMiddleware.run(rootEpic)

  /**
   * 2. Instantiate Wechaty and Install Redux Plugin
   */
  const bot = WechatyBuilder.build({ puppet: 'wechaty-puppet-mock' })
  bot.use(WechatyRedux({
    store,
  }))

  /**
   * 3. Using Redux Store with Wechaty Ducks API!
   */
  store.subscribe(() => console.info(store.getState()))

  await bot.start()

  // store.dispatch(Duck.actions.dingCommand(bot.puppet.id, 'dispatch a ding action'))
  // The above code 👆 is exactly do the same thing with the following code 👇 :
  // Duck.operations.ding(store.dispatch)(bot.puppet.id, 'call ding from operations')

  // await new Promise(setImmediate)
  await new Promise(resolve => setTimeout(resolve, 1))
  await bot.stop()
  console.info('Vanilla Redux Example finished.')
}

main()
  .catch(console.error)
