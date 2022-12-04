/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import { client } from "./api/index";
import { getDefaultProfile } from "./api/queries";
import { ConnectButton, WorldCoinWidget } from "../components";
import { WidgetProps } from "@worldcoin/id";
import LensAbi from "../abi/lens.json";
import { BigNumber, utils } from "ethers";
import { defaultAbiCoder as abi, solidityPack } from "ethers/lib/utils";
import axios from "axios";

export async function calcGas(gasEstimated: BigNumber) {
  const gas = {
    gasLimit: gasEstimated.mul(110).div(100),
    maxFeePerGas: BigNumber.from(40000000000),
    maxPriorityFeePerGas: BigNumber.from(40000000000),
  };
  try {
    const { data } = await axios({
      method: "get",
      url: "https://gasstation-mumbai.matic.today/v2",
    });
    gas.maxFeePerGas = parse(data.fast.maxFee);
    gas.maxPriorityFeePerGas = parse(data.fast.maxPriorityFee);
  } catch (error) {}
  return gas;
}

function parse(data: any) {
  return utils.parseUnits(Math.ceil(data) + "", "gwei");
}

export default function Home() {
  const [profile, setProfile] = useState<any>();
  const { address, isConnected } = useAccount();

  const [worldCoinData, setWorldCoinData] = useState<any>(null);

  const { data: signer, isError, isLoading } = useSigner();

  console.log(signer, isError, isLoading);
  const contract = useContract({
    address: "0x24131f0839829Ba6a768BEE5a33cBB24Ba8481A3",
    abi: LensAbi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (address) {
      fetchProfile();
    }
  }, [address, isConnected]);

  async function fetchProfile() {
    try {
      if (isConnected) {
        let response = await client.query({
          query: getDefaultProfile,
          variables: { address },
        });
        console.log(response.data.defaultProfile);
        setProfile(response.data.defaultProfile);
      }
    } catch (err) {
      console.error(err);
      setProfile(null);
    }
  }

  async function verifyContract() {
    // const gasEstimated = await contract?.estimateGas.verify(
    //   BigNumber.from(profile.id).toString(),
    //   worldCoinData.merkle_root,
    //   worldCoinData.nullifier_hash,
    //   abi.decode(["uint256[8]"], worldCoinData.proof as string)[0]
    // );
    // const gas = await calcGas(gasEstimated!);
    console.log(
      abi
        .decode(["uint256[8]"], worldCoinData.proof as string)[0]
        .map((e: any) => e.toString())
    );
    if (!contract) return;
    const ress = await contract.lensProfile();
    console.log(ress);

    const res = await contract.verify(
      BigNumber.from(profile.id).toString(),
      worldCoinData.merkle_root,
      worldCoinData.nullifier_hash,
      abi.decode(["uint256[8]"], worldCoinData.proof as string)[0],
      {
        gasLimit: 13000000,
        maxFeePerGas: BigNumber.from(40000000000),
        maxPriorityFeePerGas: BigNumber.from(40000000000),
        value: 0,
      }
    );
    console.log(res);
  }

  return (
    <div>
      <nav className="w-[95%] mx-auto flex justify-between items-center pt-5">
        <h1 className="text-2xl text-[#C9C4BD] font-bold">lens-rep</h1>
        <ConnectButton />
      </nav>
      {profile !== null && isConnected && (
        <section className="w-full mt-20 flex flex-col justify-center items-center">
          <div className="flex justify-center items-center flex-col">
            <div className="h-40 w-40 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={profile?.picture?.original?.url}
                alt=""
              />
            </div>

            <h1 className="text-white text-3xl">{profile?.handle}</h1>
          </div>

          <WorldCoinWidget
            profileId={profile?.id}
            setVerificationData={(data: any) => setWorldCoinData(data)}
          />
          <div
            onClick={() => verifyContract()}
            className=" mt-3 cursor-pointer px-4 py-2 bg-white font-medium rounded-full"
          >
            verify your id
          </div>
        </section>
      )}
      {isConnected && profile === null && (
        <section className="w-full flex justify-center items-center">
          <h1 className="text-white text-[1.5rem] font-medium mt-10">
            No lens profile found for this account
          </h1>
        </section>
      )}
    </div>
  );
}
