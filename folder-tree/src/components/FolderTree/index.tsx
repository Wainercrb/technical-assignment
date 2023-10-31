import { FC, useState } from 'react';

/* eslint-disable react/no-children-prop */
interface IChildren {
  name: string;
  // eslint-disable-next-line react/require-default-props
  children?: IChildren[];
}

interface IStructure {
  parent: IChildren[];
}

const structure: IStructure = {
  parent: [
    {
      name: 'root',
      children: [
        {
          name: 'A',
          children: [
            { name: 'A-1', children: [{ name: 'A-1-1' }] },
            { name: 'A-2' },
            { name: 'A-3' },
          ],
        },
        { name: 'B' },
      ],
    },
  ],
};

interface EntryProps extends IChildren {
  dept: number;
}

// eslint-disable-next-line react/function-component-definition
const Entry: FC<EntryProps> = ({ name, dept, children = [] }: EntryProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div style={{ marginLeft: dept }}>
      <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
        {name}
      </button>
      {isExpanded &&
        children.map((child) => (
          <Entry
            dept={dept + 5}
            key={child.name}
            name={child.name}
            children={child.children}
          />
        ))}
    </div>
  );
};

function FolderTree() {
  return (
    <div>
      {structure.parent.map((item) => (
        <Entry
          key={item.name}
          name={item.name}
          dept={1}
          children={item.children ?? []}
        />
      ))}
    </div>
  );
}

export default FolderTree;
