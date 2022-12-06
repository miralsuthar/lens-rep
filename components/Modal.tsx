import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { WidgetProps } from "@worldcoin/id";
import { defaultAbiCoder as abi, solidityPack } from "ethers/lib/utils";
import {
  useContractWrite,
  usePrepareContractWrite,
  useContract,
  useSigner,
} from "wagmi";
import dynamic from "next/dynamic";
import LensAbi from "../abi/lens.json";
import { BigNumber, utils } from "ethers";

function parse(data: any) {
  return utils.parseUnits(Math.ceil(data) + "", "gwei");
}

export const encodeProfileId = (profileId?: string) => {
  //   console.log(solidityPack(["uint256"], [profileId]));
  if (!profileId) return;
  return solidityPack(["uint256"], [profileId]);
};

export async function calcGas(gasEstimated: BigNumber) {
  const gas = {
    gasLimit: gasEstimated.mul(110).div(100),
    maxFeePerGas: BigNumber.from(40000000000),
    maxPriorityFeePerGas: BigNumber.from(40000000000),
  };
  try {
    const { data } = await axios({
      method: "get",
      url: "https://gasstation-mainnet.matic.network/v2",
    });
    gas.maxFeePerGas = parse(data.fast.maxFee);
    gas.maxPriorityFeePerGas = parse(data.fast.maxPriorityFee);
  } catch (error) {}
  return gas;
}

export const WorldCoinWidget = ({
  profileId,
  setVerificationData,
}: {
  profileId: string;
  setVerificationData: any;
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const customStyle = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      padding: "3rem",
      borderRadius: "1rem",
    },
  };

  const WorldIDWidget = dynamic<WidgetProps>(
    () => import("@worldcoin/id").then((mod) => mod.WorldIDWidget),
    { ssr: false }
  );

  const { data: signer, isError, isLoading } = useSigner({ chainId: 80001 });

  const contract = useContract({
    address: "0x24131f0839829Ba6a768BEE5a33cBB24Ba8481A3",
    abi: LensAbi,
    signerOrProvider: signer,
  });

  //   const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div>
      <button
        className="bg-white w-max px-6 py-2 text-[1.5rem] rounded-full font-medium mx-auto mt-5 cursor-pointer"
        onClick={() => setModalIsOpen(true)}
      >
        Verify your lens id with worldcoin
      </button>
      <Modal isOpen={modalIsOpen} style={customStyle}>
        <button
          className="text-white absolute top-2 right-4"
          onClick={() => setModalIsOpen(false)}
        >
          close
        </button>
        <WorldIDWidget
          actionId="wid_staging_7aeea6a892897e8ad211c577f88e9745"
          //   onSuccess={async (verificationResp) => {
          //     console.log(BigNumber.from(profileId).toString());
          //     // const gasEstimated = await contract?.estimateGas.verify(
          //     //   BigNumber.from(profileId).toString(),
          //     //   verificationResp.merkle_root,
          //     //   verificationResp.nullifier_hash,
          //     //   abi.decode(["uint256[8]"], verificationResp.proof as string)[0]
          //     // );
          //     // const gas = await calcGas(gasEstimated!);
          //     console.log(contract);
          //     const res = await contract?.verify(
          //       BigNumber.from(profileId).toString(),
          //       verificationResp.merkle_root,
          //       verificationResp.nullifier_hash,
          //       abi.decode(["uint256[8]"], verificationResp.proof as string)[0]
          //       //   { ...gas }
          //     );
          //     console.log("res", res);
          //   }}
          onSuccess={async (verificationResp) => {
            setVerificationData(verificationResp);
          }}
          onError={(error) => {
            console.error(error);
          }}
          enableTelemetry
          signal={encodeProfileId(profileId)}
          debug={true}
        />
      </Modal>
    </div>
  );
};
