/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ConstantPool} from '@angular/compiler/src/constant_pool';

import * as o from '../../../../output/output_ast';
import {Host} from '../ir/api';
import {CreateEmitter, UpdateEmitter} from '../output/api';

import {ChainUpdateEmitter} from './emitters/chain_emitter';
import {ClassBindingEmitter} from './emitters/class_binding_emitter';
import {ListenerEmitter} from './emitters/listener_emitter';
import {StyleBindingEmitter} from './emitters/style_binding_emitter';
import {UnsupportedCreateEmitter, UnsupportedUpdateEmitter} from './emitters/unsupported_output_driver';
import {produceBodyStatements, produceTemplateFunctionParams} from './util';

export function emitHostBindingsFunction(host: Host, constantPool: ConstantPool) {
  const createEmitters: CreateEmitter[] = [
    new ListenerEmitter(host.name),
    new UnsupportedCreateEmitter(),
  ];

  let updateEmitters: UpdateEmitter[] = [];
  updateEmitters.push(
      new StyleBindingEmitter(),
      new ClassBindingEmitter(),
      new ChainUpdateEmitter(updateEmitters),
      new UnsupportedUpdateEmitter(),
  );

  return o.fn(
      produceTemplateFunctionParams(), produceBodyStatements(host, createEmitters, updateEmitters),
      undefined, undefined, `${host.name}_HostBindings`);
}
