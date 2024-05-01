import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';
import each from 'lodash/each';
import filter from 'lodash/filter';

const hasLength = (str) => {
  if (!str || !str.length) {
    return false;
  }

  str = str.trim();

  return str.length > 0;
};

export const parseQueryParams = (query) => {
  if (!query || !query.length) {
    return [];
  }

  let params = query.split('&').map((param) => {
    let [name, value = ''] = param.split('=');
    return { name, value };
  });

  return filter(params, (p) => hasLength(p.name));
};

export const parsePathParams = (url) => {
  let uri = url.slice();

  if (!uri || !uri.length) {
    return [];
  }

  if (uri.indexOf('http://') === -1 || uri.indexOf('https://') === -1) {
    uri = `http://${uri}`;
  }

  if (!isValidUrl(uri)) {
    throw 'Invalid URL format';
  }

  uri = new URL(uri);

  let paths = uri.pathname.split('/');

  paths = paths.reduce((acc, path) => {
    if (path !== '' && path[0] === ':') {
      let name = path.slice(1, path.length);
      if (name) {
        let isExist = find(acc, (path) => path.name === name);
        if (!isExist) {
          acc.push({ name: path.slice(1, path.length), value: '' });
        }
      }
    }
    return acc;
  }, []);

  return paths;
};

export const stringifyQueryParams = (params) => {
  if (!params || isEmpty(params)) {
    return '';
  }

  let queryString = [];
  each(params, (p) => {
    const hasEmptyName = isEmpty(trim(p.name));
    const hasEmptyVal = isEmpty(trim(p.value));

    // query param name must be present
    if (!hasEmptyName) {
      // if query param value is missing, push only <param-name>, else push <param-name: param-value>
      queryString.push(hasEmptyVal ? p.name : `${p.name}=${p.value}`);
    }
  });

  return queryString.join('&');
};

export const splitOnFirst = (str, char) => {
  if (!str || !str.length) {
    return [str];
  }

  let index = str.indexOf(char);
  if (index === -1) {
    return [str];
  }

  return [str.slice(0, index), str.slice(index + 1)];
};

export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};
