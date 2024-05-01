import React from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import cloneDeep from 'lodash/cloneDeep';
import { IconTrash } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import { useTheme } from 'providers/Theme';
import {
  addQueryParam,
  updateQueryParam,
  deleteQueryParam,
  updatePathParam
} from 'providers/ReduxStore/slices/collections';
import SingleLineEditor from 'components/SingleLineEditor';
import { sendRequest, saveRequest } from 'providers/ReduxStore/slices/collections/actions';

import StyledWrapper from './StyledWrapper';

const QueryParams = ({ item, collection }) => {
  const dispatch = useDispatch();
  const { storedTheme } = useTheme();
  const params = item.draft ? get(item, 'draft.request.params') : get(item, 'request.params');
  const paths = (item.draft ? get(item, 'draft.request.paths') : get(item, 'request.paths')) ?? [];

  const handleAddParam = () => {
    dispatch(
      addQueryParam({
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const onSave = () => dispatch(saveRequest(item.uid, collection.uid));
  const handleRun = () => dispatch(sendRequest(item, collection.uid));

  const handleValueChange = (data, type, value) => {
    const _data = cloneDeep(data);

    if (!has(_data, type)) {
      return;
    }

    _data[type] = value;

    return _data;
  };

  const handleParamChange = (e, data, type) => {
    let value;

    switch (type) {
      case 'name': {
        param.name = e.target.value;
        value = e.target.value;
        break;
      }
      case 'value': {
        param.value = e.target.value;
        value = e.target.value;
        break;
      }
      case 'enabled': {
        param.enabled = e.target.checked;
        value = e.target.checked;
        break;
      }
    }

    const param = handleValueChange(data, type, value);

    dispatch(
      updateQueryParam({
        param,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const handleRemoveParam = (param) => {
    dispatch(
      deleteQueryParam({
        paramUid: param.uid,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const handlePathChange = (e, data) => {
    let value = e.target.value;

    const path = handleValueChange(data, 'value', value);

    dispatch(
      updatePathParam({
        path,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  return (
    <StyledWrapper className="w-full">
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Value</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {params && params.length
            ? params.map((param, index) => {
                return (
                  <tr key={param.uid}>
                    <td>
                      <input
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={param.name}
                        className="mousetrap"
                        onChange={(e) => handleParamChange(e, param, 'name')}
                      />
                    </td>
                    <td>
                      <SingleLineEditor
                        value={param.value}
                        theme={storedTheme}
                        onSave={onSave}
                        onChange={(newValue) =>
                          handleParamChange(
                            {
                              target: {
                                value: newValue
                              }
                            },
                            param,
                            'value'
                          )
                        }
                        onRun={handleRun}
                        collection={collection}
                      />
                    </td>
                    <td>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          tabIndex="-1"
                          className="mr-3 mousetrap"
                          onChange={(e) => handleParamChange(e, param, 'enabled')}
                        />
                        <button tabIndex="-1" onClick={() => handleRemoveParam(param)}>
                          <IconTrash strokeWidth={1.5} size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
      <button className="btn-add-param text-link pr-2 py-3 mt-2 select-none" onClick={handleAddParam}>
        +&nbsp;<span>Add Param</span>
      </button>

      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Value</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {paths && paths.length
            ? paths.map((path, index) => {
                return (
                  <tr key={path.uid}>
                    <td>
                      <input
                        type="text"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        value={path.name}
                        className="mousetrap"
                      />
                    </td>
                    <td>
                      <SingleLineEditor
                        value={path.value}
                        theme={storedTheme}
                        onSave={onSave}
                        onChange={(newValue) =>
                          handlePathChange(
                            {
                              target: {
                                value: newValue
                              }
                            },
                            path
                          )
                        }
                        onRun={handleRun}
                        collection={collection}
                      />
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>

      <div>Paths</div>
      {JSON.stringify(paths)}
    </StyledWrapper>
  );
};
export default QueryParams;
