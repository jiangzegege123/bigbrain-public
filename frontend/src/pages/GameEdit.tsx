const GameEdit = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { token } = useAuth();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState("");

  const loadGame = useCallback(async () => {
    try {
      const { games } = await fetchGames(token!);
      const found = games.find((g: Game) => g.id.toString() === gameId);
      if (!found) throw new Error("Game not found");
      setGame(found);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }, [token, gameId]);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  // Add question
  const handleAdd = async () => {
    try {
      const { games } = await fetchGames(token!);
      const updatedGames = games.map((g: Game) => {
        if (g.id.toString() !== gameId) return g;

        const newQuestion: Question = {
          id: Math.floor(Math.random() * 1_000_000_000), // 生成唯一 id
          question: "",
          duration: 30,
          points: 100,
          type: "single",
          options: [],
        };

        return {
          ...g,
          questions: [...g.questions, newQuestion],
        };
      });

      await updateGames(token!, updatedGames);
      await loadGame();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  // Delete question
  const handleDelete = async (questionId: number) => {
    try {
      const { games } = await fetchGames(token!);
      const updatedGames = games.map((g) => {
        if (g.id.toString() !== gameId) return g;

        // 删除该 game 中 id 匹配的 question
        const filteredQuestions = g.questions.filter(
          (q) => q.id !== questionId
        );
        return {
          ...g,
          questions: filteredQuestions,
        };
      });

      await updateGames(token!, updatedGames);
      await loadGame();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  };

  if (!game)
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-8 flex justify-center items-center min-h-[calc(100vh-64px)]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Edit Game: {game.name}
              </h1>
              <p className="text-gray-500 mt-1">Manage your game questions</p>
            </div>
            <Button
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Question
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {game.questions.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <HelpCircle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Questions Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first question
            </p>
            <Button
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {game.questions.map((q: Question, index: number) => (
              <div
                key={q.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 py-3 px-4">
                  <h2 className="font-semibold text-white flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Question {index + 1}
                  </h2>
                </div>
                <div className="p-4">
                  <p className="text-gray-700 font-medium mb-4 line-clamp-2 min-h-[3rem]">
                    {q.question || "New question"}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <Clock className="h-3 w-3 mr-1" />
                      {q.duration}s
                    </div>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      <Award className="h-3 w-3 mr-1" />
                      {q.points} pts
                    </div>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {q.type}
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <Link
                      to={`/game/${game.id}/question/${q.id}`}
                      className="w-full mr-2"
                    >
                      <Button variant="outline" className="w-full">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    {typeof q.id === "number" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(q.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GameEdit;
