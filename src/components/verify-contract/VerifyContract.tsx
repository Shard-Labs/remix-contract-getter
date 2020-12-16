import React, {useState, useReducer, useEffect} from "react";
import { Alert, Spinner } from "../common";
import { REPOSITORY_URL, chainOptions, REPOSITORY_URL_PARTIAL_MATCH, REPOSITORY_URL_FULL_MATCH } from '../../common/Constants';
import { useStateContext, useDispatchContext } from "../../state/Store";
import { remixClient } from "../../remix/RemixClient";
import { AddressInput } from "../common/form/AddressInput"
import { Dropdown } from "../common/form/Dropdown"
import { VerificationResult } from "../../state/types";

export type IVerifyState = {
    isLoading: boolean,
    error: any,
    chain: any,
    address: string,
    files: [],
    isListening: boolean
}

export type IVerifyActions = {
    type: 'set_loading' | 'set_error' | 'set_address' | 'set_chain' | 'set_files' | 'set_listening';
    payload?: any
}

export const reducer = (state: IVerifyState, action: IVerifyActions) => {
    switch(action.type) {
        case 'set_loading':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'set_error':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case 'set_address':
            return {
                ...state,
                address: action.payload
            };
        case 'set_chain':
            return {
                ...state,
                chain: action.payload
            };
        case 'set_files':
            return {
                ...state,
                files: action.payload
            };
        case 'set_listening':
            return {
                ...state,
                isListening: action.payload
            }
        default:
            return state;
        }
}

export const VerifyContract: React.FC = () => {

    const initialState: IVerifyState = {
        isLoading: false,
        chain: chainOptions[0],
        address: '',
        error: null,
        files: [],
        isListening: false
    }

    const stateContext = useStateContext();
    const dispatchContext = useDispatchContext();

    const [state, dispatch] = useReducer(reducer, initialState);

    // if (!state.isListening) {
    //     remixClient.listenOnCompilationFinishedEvent((data: any) => {
    //         dispatch({ type: 'set_files', payload: [data.target.replace("browser/", ""), "metadata.json"] });
    //         console.log('HERE')
    //     });
    //
    //         console.log('DISPATCH')
    //     dispatch({ type: 'set_listening', payload: true});
    //     console.log(state.isListening)
    // }

    useEffect(() => {
        if (!state.isListening) {
            remixClient.listenOnCompilationFinishedEvent((data: any) => {
                dispatch({type: 'set_files', payload: [data.target.replace("browser/", ""), "metadata.json"]});
            });
            dispatch({type: 'set_listening', payload: true});
        }
    }, [state.isListening])

    const onSubmit = async (e: any) => {
        e.preventDefault();
        dispatch({ type: 'set_error', payload: null} );
        dispatchContext({ type: 'set_verification_result', payload: null} );
        dispatch({ type: 'set_loading', payload: true })

        const formData = new FormData();

        formData.append('address', state.address);
        formData.append('chain', state.chain.id.toString());

        if (state.files.length > 0) {
            state.files.forEach((file: any) => formData.append('files', file));
        }

        const response: VerificationResult = await remixClient.verifyByForm(formData)
        //const response: VerificationResult = await remixClient.verify(state.address, state.chain.id.toString(), state.files); // To test verify
        if(response[0].status === 'no match'){
            dispatch({ type: 'set_error', payload: response[0].message} );
            dispatch({ type: 'set_loading', payload: false }); 
        } else {
            dispatchContext({ type: 'set_verification_result', payload: response} );
            dispatch({ type: 'set_loading', payload: false });
        }
          
    }

    return (
        <div>
            <p className="card-text my-2">
                Uploads, verifies & publishes a deployed contract's metadata and source files.
            </p>
            <p className="card-text my-2">
                Note: the metadata must be exactly the same as at deployment time
            </p>
            <p className="card-text my-2">
                Browse repository <a href={`${REPOSITORY_URL}`} target="_blank" rel="noopener noreferrer" >here</a> or via <a href="https://gateway.ipfs.io/ipns/QmNmBr4tiXtwTrHKjyppUyAhW1FQZMJTdnUrksA9hapS4u" target="_blank" rel="noopener noreferrer" >ipfs/ipns gateway.</a>
            </p>
            <form className="d-flex flex-column" onSubmit={onSubmit}>
                <Dropdown 
                    chainOptions={chainOptions}
                    chain={state.chain}
                     setChain={(chain: any) => dispatch({ type: 'set_chain', payload: chain })} />
                <AddressInput 
                    setAddress={(address: string) => dispatch({ type: 'set_address', payload: address })} />
                <button 
                    type="submit" 
                    className="btn btn-primary my-2" 
                    disabled={!state.address}>Verify</button>
                {
                    state.files.length > 0 &&
                    <>
                        <label className="text-muted mt-2">FILES</label>
                        <ul className="border p-2 d-flex flex-column text-muted align-items-center">
                            {state.files.map(file => <li key={file}>{file}</li>)}
                        </ul>
                    </>
                }
            </form>
            {
                state.isLoading && <Spinner />
            }
            {
                state.error && <Alert type={'danger'} heading={state.error}>
                               </Alert>
            }
            {
                stateContext.verificationResult && !state.error && (
                    stateContext.verificationResult[0].status === "perfect" ?
                    <Alert type={'success'} heading='Contract successfully verified!'>
                        <p className="m-0 mt-2">
                            View the verified assets in the <a href={`${REPOSITORY_URL_FULL_MATCH}/${state.chain.id}/${stateContext.verificationResult[0].address}`} target="_blank"rel="noopener noreferrer" > Contract Repo.
                        </a>
                        </p>
                        {/* {
                            stateContext.verificationResult &&
                            <p>Found {stateContext.verificationResult.length} addresses of this contract: {stateContext.verificationResult[0].address}</p>
                        } */}
                    </Alert>
                    :
                    <Alert type={'success'} heading='Contract partially verified!'>
                        <p className="m-0 mt-2">
                            View the partially verified assets in the <a href={`${REPOSITORY_URL_PARTIAL_MATCH}/${state.chain.id}/${stateContext.verificationResult[0].address}`} 
                            target="_blank"rel="noopener noreferrer" > Contract Repo.</a>
                        </p>
                    </Alert>
                )
            }
            <p className="my-1">Questions: <a
                href="https://gitter.im/ethereum/source-verify" target="_blank" rel="noopener noreferrer" >Gitter</a>
            </p>
            <p className="my-1">Source code: <a
                href="https://github.com/ethereum/sourcify" target="_blank" rel="noopener noreferrer" >GitHub</a>
            </p>
            <p className="m-0">Feel free to contribute.</p>
        </div>
    )
};
