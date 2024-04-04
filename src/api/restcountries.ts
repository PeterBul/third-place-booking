import axios from 'axios';

interface ICountry {
  name: {
    common: string;
    official: string;
    nativeName: {
      eng: {
        official: string;
        common: string;
      };
    };
  };
  idd: {
    root: string;
    suffixes: string;
  };
  flag: string;
}

export const getCountriesWithCodes = async () => {
  return (
    await axios.get<ICountry[]>(
      'https://restcountries.com/v3.1/independent?fields=name,idd,flag'
    )
  ).data;
};
