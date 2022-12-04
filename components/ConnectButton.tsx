import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export const ConnectButton = () => {
  const { address, isConnected } = useAccount();

  const { connect, connectors, isLoading, pendingConnector } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  return (
    <div>
      <div
        onClick={() => {
          isConnected ? disconnect() : connect();
        }}
        className="bg-[#DDE7EA] cursor-pointer w-max px-4 py-2 rounded-full"
      >
        {isConnected ? `${address?.substring(0, 8)}...` : "Connect wallet"}
      </div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}
    </div>
  );
};
