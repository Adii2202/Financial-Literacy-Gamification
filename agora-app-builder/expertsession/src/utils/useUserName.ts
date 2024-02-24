import useSetName from './useSetName';
import useGetName from './useGetName';

/**
 * The UserName app state governs the local user's display name.
 */
export default function useUserName(): [
  string,
  React.Dispatch<React.SetStateAction<string>>,
] {
  const setName = useSetName();
  const name = useGetName();
  return [name, setName];
}
