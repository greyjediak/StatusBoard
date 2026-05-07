// Main frontend app Lindsey B.
// 5/7/2026

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
    const [statuses, setStatuses] = useStatt([]); //stroes 
    const [title, setTitle] = useState(""); //stores input
    const [msg, setMsg] = useState(""); //input msg
    const [severity, setSeverity] = useState("low"); //request state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadPosts() {
            try {
                setError("");
                const response = await fetch(API_URL);
            }
            catch (err){
                setError("Could not load statuses. Check if backend running");
            }
        }
        loadStatuses();
    })

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
                    </form>
                </section>
            </main>
        </div>

    );
}


ReactDOM.createRoot(document.getElementById("root")).render(<StatusBoard />)