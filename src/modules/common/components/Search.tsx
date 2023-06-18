import { ChangeEvent, FC, FormEvent, useMemo, useState } from 'react';

import { debounce } from '@app/helpers/timers/debounce.helper';

import { Dropdown } from './Dropdown';
import { TextBox } from './TextBox';

interface Props {
  className?: string;
  searchKeys?: string[];
  onSearch?: (data: { searchKey?: string; searchString: string }) => void;
  isAutoSearchAllowed?: boolean;
}

export const Search: FC<Props> = ({
  className,
  searchKeys,
  onSearch,
  isAutoSearchAllowed,
}) => {
  // Properties

  const [searchKey, setSearchKey] = useState(searchKeys ? searchKeys[0] : '');
  const [searchString, setSearchString] = useState('');

  const debouncedOnSearch = useMemo(() => {
    if (onSearch && isAutoSearchAllowed) {
      return debounce(onSearch);
    }
    return null;
  }, [onSearch, isAutoSearchAllowed]);

  // Handlers

  const handleSelectSearchKey = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSearchKey(e.target.value);
  };

  const handleChangeSearchString = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchString(e.target.value);

    debouncedOnSearch?.(500, {
      searchKey,
      searchString: e.target.value,
    });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (debouncedOnSearch) {
      debouncedOnSearch(0, {
        searchKey,
        searchString,
      });
    } else if (onSearch) {
      onSearch({
        searchKey,
        searchString,
      });
    }
  };

  // Elements

  return (
    <div className={className}>
      <form className="flex flex-row space-x-4" onSubmit={handleSearch}>
        {searchKeys && (
          <div className="w-64">
            <Dropdown
              id="searchKeys"
              values={searchKeys}
              selectedValue={searchKey ?? ''}
              onChange={handleSelectSearchKey}
            />
          </div>
        )}
        <div className="w-64">
          <TextBox
            type="text"
            value={searchString}
            placeholder="Search..."
            onChange={handleChangeSearchString}
          />
        </div>
      </form>
    </div>
  );
};
