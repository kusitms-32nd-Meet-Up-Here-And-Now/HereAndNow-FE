import { useQuery } from '@tanstack/react-query';
import api from '@apis/common/api';

const useGetMemberInfo = () => {
  return useQuery({
    queryKey: ['memberInfo'],
    queryFn: async () => {
      const res = await api.get('/member');
      return res.data;
    },
  });
};

export default useGetMemberInfo;
