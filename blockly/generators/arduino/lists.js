/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Arduino code for list blocks.
 *
 * TODO: A lot of this can be converted to arrays code by creating functions to
 *       replicate this kind of behavior.
 */
'use strict';

goog.provide('Blockly.Arduino.lists');

goog.require('Blockly.Arduino');


// Blockly.Arduino['lists_create_empty'] = Blockly.Arduino.noGeneratorCodeInline;
Blockly.Arduino['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['{}', Blockly.Arduino.ORDER_ATOMIC];
};

// Blockly.Arduino['lists_create_with'] = Blockly.Arduino.noGeneratorCodeInline;
Blockly.Arduino['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  var code = new Array(block.itemCount_);
  for (var n = 0; n < block.itemCount_; n++) {
    code[n] = Blockly.Arduino.valueToCode(block, 'ADD' + n,
        Blockly.Arduino.ORDER_COMMA) || 'None';
  }
  code = '{' + code.join(', ') + '}';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

// Blockly.Arduino['lists_repeat'] = Blockly.Arduino.noGeneratorCodeInline;
Blockly.Arduino['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  var functionName = Blockly.Arduino.provideFunction_(
      'lists_repeat',
      [ 'int *' + Blockly.Arduino.FUNCTION_NAME_PLACEHOLDER_ +
          '(int value, int n) {',
        '  int array[n];',
        '  for (int i = 0; i < n; i++) {',
        '    array[i] = value;',
        '  }',
        '  return array;',
        '}']);
  var argument0 = Blockly.Arduino.valueToCode(block, 'ITEM',
      Blockly.Arduino.ORDER_NONE) || 'null';
  var argument1 = Blockly.Arduino.valueToCode(block, 'NUM',
      Blockly.Arduino.ORDER_MULTIPLICATIVE) || '0';
  var code = functionName + '(' + argument0 + ', ' + argument1 + ')';
  return [code, Blockly.Arduino.ORDER_MULTIPLICATIVE];
};

// Blockly.Arduino['lists_length'] = Blockly.Arduino.noGeneratorCodeInline;
Blockly.Arduino['lists_length'] = function(block) {
  // String or array length.
  var argument0 = Blockly.Arduino.valueToCode(block, 'VALUE',
      Blockly.Arduino.ORDER_NONE) || '{}';
  return ['sizeof(' + argument0 + ')', Blockly.Arduino.ORDER_FUNCTION_CALL];
};

Blockly.Arduino['lists_isEmpty'] = Blockly.Arduino.noGeneratorCodeInline;

Blockly.Arduino['lists_indexOf'] = Blockly.Arduino.noGeneratorCodeInline;

// Blockly.Arduino['lists_getIndex'] = Blockly.Arduino.noGeneratorCodeInline;
Blockly.Arduino['lists_getIndex'] = function(block) {
  // Get element at index.
  // Note: Until January 2013 this block did not have MODE or WHERE inputs.
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var at = Blockly.Arduino.valueToCode(block, 'AT',
      Blockly.Arduino.ORDER_ADDITIVE) || '1';
  var list = Blockly.Arduino.valueToCode(block, 'VALUE',
      Blockly.Arduino.ORDER_MEMBER) || '[]';

  if (where == 'FIRST') {
    if (mode == 'GET') {
      var code = list + '[0]';
      return [code, Blockly.Arduino.ORDER_MEMBER];
    } else {
      
    }
  } else if (where == 'LAST') {
    if (mode == 'GET') {
      var code = list + '[sizeof(' + list + ')/sizeof(int) - 1]';
      return [code, Blockly.Arduino.ORDER_MEMBER];
    } else {
      
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at = 'int(' + at + ' - 1)';
    }
    if (mode == 'GET') {
      var code = list + '[' + at + ']';
      return [code, Blockly.Arduino.ORDER_MEMBER];
    } else {
      
    }
  } else if (where == 'FROM_END') {
    if (mode == 'GET') {
      var code = list + '[sizeof(' + list + ')/sizeof(int) - ' + at + ']';
      return [code, Blockly.Arduino.ORDER_MEMBER];
    } else {
      
    }
  } else if (where == 'RANDOM') {
    if (mode == 'GET') {
      code = list + '[random(0, sizeof(' + list + ')/sizeof(int))]';
      return [code, Blockly.Arduino.ORDER_FUNCTION_CALL];
    } else {
      
    }
  }
  throw 'Unhandled combination (lists_getIndex).';
};

// Blockly.Arduino['lists_setIndex'] = Blockly.Arduino.noGeneratorCodeLine;
Blockly.Arduino['lists_setIndex'] = function(block) {
  // Set element at index.
  // Note: Until February 2013 this block did not have MODE or WHERE inputs.
  var list = Blockly.Arduino.valueToCode(block, 'LIST',
      Blockly.Arduino.ORDER_MEMBER) || '[]';
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var at = Blockly.Arduino.valueToCode(block, 'AT',
      Blockly.Arduino.ORDER_NONE) || '1';
  var value = Blockly.Arduino.valueToCode(block, 'TO',
      Blockly.Arduino.ORDER_NONE) || 'None';
  // Cache non-trivial values to variables to prevent repeated look-ups.
  // Closure, which accesses and modifies 'list'.
  function cacheList() {
    if (list.match(/^\w+$/)) {
      return '';
    }
    var listVar = Blockly.Arduino.variableDB_.getDistinctName(
        'tmp_list', Blockly.Variables.NAME_TYPE);
    var code = listVar + ' = ' + list + '\n';
    list = listVar;
    return code;
  }
  if (where == 'FIRST') {
    if (mode == 'SET') {
      return list + '[0] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      
    }
  } else if (where == 'LAST') {
    if (mode == 'SET') {
      return list + '[sizeof(' + list + ')/sizeof(int) - 1] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at = 'int(' + at + ' - 1)';
    }
    if (mode == 'SET') {
      return list + '[' + at + '] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      
    }
  } else if (where == 'FROM_END') {
    if (mode == 'SET') {
      return list + '[sizeof(' + list + ')/sizeof(int) - ' + at + '] = ' + value + '\n';      
    } else if (mode == 'INSERT') {
      
    }
  } else if (where == 'RANDOM') {
    var code = cacheList();
    var xVar = Blockly.Arduino.variableDB_.getDistinctName(
        'tmp_x', Blockly.Variables.NAME_TYPE);
    code += xVar + ' = int(random.random() * len(' + list + '))\n';
    if (mode == 'SET') {
      code += list + '[' + xVar + '] = ' + value + '\n';
      return code;
    } else if (mode == 'INSERT') {
      
    }
  }
  throw 'Unhandled combination (lists_setIndex).';
};
