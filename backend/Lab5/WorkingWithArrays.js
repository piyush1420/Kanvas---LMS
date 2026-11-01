let todos = [
    { id: 1, title: "Task 1", completed: false },
    { id: 2, title: "Task 2", completed: true },
    { id: 3, title: "Task 3", completed: false },
    { id: 4, title: "Task 4", completed: true },
  ];
  
  export default function WorkingWithArrays(app) {
    // ---- validator for any route that has :id ----
    // app.param("id", (req, res, next, id) => {
    //   const numericId = parseInt(id, 10);
    //   const exists = todos.some((t) => t.id === numericId);
    //   if (!exists) {
    //     res.status(404).json({ message: "id not present" });
    //     return; // stop here; don't run the original handlers
    //   }
    //   next(); // id exists; proceed as usual
    // });
  
    const getTodos = (req, res) => {
      const { completed } = req.query;
      if (completed !== undefined) {
        const completedBool = completed === "true";
        const completedTodos = todos.filter(
          (t) => t.completed === completedBool
        );
        res.json(completedTodos);
        return;
      }
  
      res.json(todos);
    };
  
    const createNewTodo = (req, res) => {
      const newTodo = {
        id: new Date().getTime(),
        title: "New Task",
        completed: false,
      };
      todos.push(newTodo);
      res.json(todos);
    };

    // POST
    const postNewTodo = (req, res) => {
      const newTodo = { ...req.body, id: new Date().getTime() };
      todos.push(newTodo);
      res.json(newTodo);
    };
  
  
    const removeTodo = (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      todos.splice(todoIndex, 1);
      res.json(todos);
    };

    // REMOVE
    const deleteTodo = (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
        return;
      }
  
      todos.splice(todoIndex, 1);
      res.sendStatus(200);
    };
    
  
    const updateTodoTitle = (req, res) => {
      const { id, title } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      todo.title = title;
      res.json(todos);
    };
  
    const updateCompletedStatus = (req, res) => {
      const { id, completed } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      todo.completed = completed === "true";
      res.json(todos);
    };
  
    const updateDescription = (req, res) => {
      const { id, description } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      todo.description = description;
      res.json(todos);
    };
    // PUT
    const updateTodo = (req, res) => {
      const { id } = req.params;
      const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
      if (todoIndex === -1) {
        res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
        return;
      }

      todos = todos.map((t) => {
        if (t.id === parseInt(id)) {
          return { ...t, ...req.body };
        }
        return t;
      });
      res.sendStatus(200);
    };
    
  
    const getTodoById = (req, res) => {
      const { id } = req.params;
      const todo = todos.find((t) => t.id === parseInt(id));
      res.json(todo);
    };
  
    app.get("/lab5/todos/:id/title/:title", updateTodoTitle);
    // completed boolean's edit route
    app.get("/lab5/todos/:id/completed/:completed", updateCompletedStatus);
    // description edit route
    app.get("/lab5/todos/:id/description/:description", updateDescription);
    // DELETE
    app.delete("/lab5/todos/:id", deleteTodo);
    app.get("/lab5/todos/:id/delete", removeTodo);
    app.get("/lab5/todos", getTodos);
    app.get("/lab5/todos/create", createNewTodo); // order matters here
    // POST
    app.post("/lab5/todos", postNewTodo);
    app.get("/lab5/todos/:id", getTodoById);
    // PUT
    app.put("/lab5/todos/:id", updateTodo);
  }
  