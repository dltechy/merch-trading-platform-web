import { ChangeEvent, FC, FormEvent, useState } from 'react';

import { Dropdown } from './Dropdown';
import { TextBox } from './TextBox';

interface Props {
  className?: string;
  searchKeys?: string[];
  onSearch?: (data: { searchKey?: string; searchString: string }) => void;
}

export const Search: FC<Props> = ({ className, searchKeys, onSearch }) => {
  // Properties

  const [searchKey, setSearchKey] = useState(searchKeys ? searchKeys[0] : '');
  const [searchString, setSearchString] = useState('');

  // Handlers

  const handleSelectSearchKey = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSearchKey(e.target.value);
  };

  const handleChangeSearchString = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchString(e.target.value);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    onSearch?.({
      searchKey,
      searchString,
    });
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
