import { useFormikContext } from 'formik';
import { FC, createContext, PropsWithChildren, useContext } from 'react';

import { getSponsorByIdUrl } from '../constants/tyket.api';
import { UseFetchResult, useFetch } from '../hooks/useFetch';
import { ISignupFields } from '../types/signupFlow';
import { TykBrokerSponsorResult } from '../types/tykbroker';

const initialState: UseFetchResult<TykBrokerSponsorResult> = {
  data: null,
  error: null,
  loading: false,
  resend: () => Promise.reject(),
};

export const SponsorContext = createContext<UseFetchResult<TykBrokerSponsorResult>>(initialState);

interface SponsorContextProviderProps {
  id: string;
}

export const SponsorContextProvider: FC<PropsWithChildren<SponsorContextProviderProps>> = ({
  id,
  children,
}): JSX.Element => {
  const sponsorRequest = useFetch<TykBrokerSponsorResult>(getSponsorByIdUrl(id), undefined, {
    skip: !id,
  });

  return <SponsorContext.Provider value={sponsorRequest}>{children}</SponsorContext.Provider>;
};

export const SponsorFormikContextProvider: FC<PropsWithChildren<object>> = ({ children }) => {
  const {
    values: { referringTykBrokerStep },
  } = useFormikContext<ISignupFields>();

  return (
    <SponsorContextProvider id={referringTykBrokerStep.tbaSponsorId}>
      {children}
    </SponsorContextProvider>
  );
};

export const useSponsor = (): UseFetchResult<TykBrokerSponsorResult> => useContext(SponsorContext);
