// Main frontend app Lindsey B.
// 5/7/2026

const {useState, useEffect} = React; 

const API_URL = "http://localhost:4000/api/statuses";
const SEVERITY_LABEL = {
    low: { label: "Low", icon:"●"},
    medium: { label: "Medium", icon:"▢"},
    high: {label: "High", icon: "▲"},
    warning: {label: "Warning", icon: "⬠"},
    critical: {label: "Critical", icon: "!"},
    info: {label: "Info", icon: "ℹ"}
}
function StatusBoard() {
    const [statuses, setStatuses] = useState([]); //stroes 
    const [title, setTitle] = useState(""); //stores input
    const [msg, setMsg] = useState(""); //input msg
    const [severity, setSeverity] = useState("low"); //request state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadStatuses() {
            try {
            setError("");
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to load");
            }

            const data = await response.json();
            setStatuses(data);
            } catch (err) {
                setError("Could not load statuses. Check if backend running");
            }
        }

        loadStatuses();
    }, []);

    async function handleSubmit(e) {
         e.preventDefault(); //keep page from reloading

        // Turns on loading state and clear errors
        setLoading(true);
        setError("");

        try{

            // Send form data to backend as JSOn
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, msg, severity})
            });

            // Read backend response
            const data = await response.json();
            if(!response.ok) {
                setError(data.error || "Something went wrong. Try reloading your browser.");
                return;
            }
            setStatuses([data, ...statuses]); // add new status to top of feed
            setTitle("");
            setMsg("");
            setSeverity("low");
            }
            catch (err) {
                setError("Could not post new status. Please check your server connection and try again.");
            }
        finally {
            setLoading(false); // Turn off loading
        }
    }

    return (
        <div>
            <main className="page">
                <section className="form-panel">
                    <h2>Post Your Status</h2>
                    <form onSubmit={handleSubmit}>

                        <label>Title</label>
                        <input value={title} onChange={(e) =>setTitle(e.target.value)} placeholder="Title of Staus Here" required />
                        
                    
                        <label>Message</label>
                        <input value={msg} onChange={(e) =>setTitle(e.target.value)} placeholder="Enter description here" required />
                        
                        <label>Severity</label>
                        <p>Choose a severity class</p>
                        <div className="radio-row">
                            {Object.entries(SEVERITY_LABEL).map(([key, value]) => (
                            <button
                                key={key}
                                type="button"
                                data-severity={key}
                                className={severity === key ? "choice selected" : "choice"}
                                onClick={() => setSeverity(key)}
                            >
                                <span className="shape">{value.icon}</span>
                                {value.label}
                            </button>
                        ))}
                        </div>
                        {error && <p className="form-error">{error}</p>}
                        <button className="submit-btn" type="submit" disabled={loading}>
                            {loading ? "Posting....." : "Post Status"}
                        </button>

                    </form>
                </section>

                <section className="feed-panel">
                    <h2>Status Feed</h2>

                    {statuses.length === 0 ? (
                        <p className="empty">Post a status to see it appear in the feed.</p>
                    ) : (
                        statuses.map((status) => (
                            <article className="sticky-note" key={status.id} data-severity={status.severity}>
                                <div className="feed-header">
                                    <h3>{status.title}</h3>
                                    <span>
                                        {new Date(status.createdAt).toLocaleString([], {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                                <p className="feed-message">{status.msg}</p>
                                <span className="tag" data-severity={status.severity}>
                                    {SEVERITY_LABEL[status.severity].icon} {SEVERITY_LABEL[status.severity].label}
                                </span>
                            </article>
                        ))
                    )}
                </section>


            </main>
        </div>

    );
}


ReactDOM.createRoot(document.getElementById("root")).render(<StatusBoard />)