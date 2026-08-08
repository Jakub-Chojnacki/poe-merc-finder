import FilterEditor from '@/components/filter-editor';
import { createEmptyFilterDraft } from '@/utils/filter-draft';
import { isTradePageInfo } from "@/utils/trade-page-messaging";
import { GET_TRADE_PAGE_INFO } from "@/utils/trade-page-messaging/const";
import type { ConnectionState } from "./types";

const MainSidebar: React.FC = () => {
  const [connection, setConnection] = useState<ConnectionState>({
    status: "loading",
  });

  const [filterDraft, setFilterDraft] = useState(createEmptyFilterDraft);

  const checkConnection = useCallback(async () => {
    setConnection({ status: "loading" });

    const [activeTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (activeTab?.id === undefined) {
      setConnection({ status: "unsupported" });
      return;
    }

    try {
      const response: unknown = await browser.tabs.sendMessage(activeTab.id, {
        type: GET_TRADE_PAGE_INFO,
      });

      console.log(response)

      if (!isTradePageInfo(response)) {
        setConnection({ status: "unsupported" });
        return;
      }

      setConnection({ status: "connected" });
    } catch(error) {
      setConnection({ status: "unsupported" });
      console.log(error)
    }
  }, []);

  useEffect(() => {
    checkConnection();

    const handleTabActivated = () => {
      checkConnection();
    };

    const handleTabUpdated = (
      _tabId: number,
      changeInfo: { status?: string },
    ) => {
      if (changeInfo.status === "complete") {
        checkConnection();
      }
    };

    browser.tabs.onActivated.addListener(handleTabActivated);
    browser.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      browser.tabs.onActivated.removeListener(handleTabActivated);
      browser.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, [checkConnection]);

  const isConnected = connection.status === "connected";

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="panel-eyebrow">Path of Exile Trade</p>
          <h1>Mercenary Support Filter</h1>
        </div>

        <span
          className={`status-badge status-badge--${connection.status}`}
          aria-live="polite"
        >
          {connection.status === "loading"
            ? "Checking"
            : isConnected
              ? "Connected"
              : "Not connected"}
        </span>
      </header>

      <section className="connection-card" aria-labelledby="connection-title">
        <h2 id="connection-title">
          {connection.status === "loading"
            ? "Looking for a trade search"
            : isConnected
              ? "Connected to the trade page"
              : "Open a supported PoE trade search"}
        </h2>
        <p>
          {isConnected
            ? "Manual filters are ready to configure."
            : "Navigate to a Path of Exile trade search, then check the connection again."}
        </p>

        <button type="button" onClick={() => checkConnection()}>
          Check again
        </button>
      </section>

      <FilterEditor value={filterDraft} onChange={setFilterDraft} />
    </main>
  );
};
export default MainSidebar;
