const titlecase = (input) => input[0].toLocaleUpperCase() + input.slice(1);

// eslint-disable-next-line import/prefer-default-export
export const pascalcase = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value.toString !== 'function') {
    return '';
  }

  const input = value.toString().trim();
  if (input === '') {
    return '';
  }
  if (input.length === 1) {
    return input.toLocaleUpperCase();
  }

  const match = input.match(/[a-zA-Z0-9]+/g);
  if (match) {
    return match.map((m) => titlecase(m)).join('');
  }

  return input;
};
