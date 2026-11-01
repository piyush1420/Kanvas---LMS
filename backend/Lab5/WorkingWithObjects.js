const assignment = {
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  };

  const module = {
    id: 101, name: "Web Development",
    description: "Learn to develop web applications",
    course : "CS5610",
  }


  
  const getAssignmentTitle   = (req, res) => {
    res.json(assignment.title);
  };
  const setAssignmentTitle   = (req, res) => {
    const {newTitle} = req.params;
    assignment.title = newTitle;
    res.json(assignment.title);
  };

  const setAssignmentCompleted   = (req, res) => {
    const {completed} = req.params;
    assignment.completed = (completed === 'true');
    res.json(assignment.completed);
  }
  const setAssignmentScore   = (req, res) => {
    const {score} = req.params;
    assignment.score = parseFloat(score);
    res.json(assignment.score);
  };

  const getModuleName  = (req, res) => {
    res.json(module.name);
  };

  const setModuleName  = (req, res) => {
    const {newName} = req.params;
    module.name = newName;
    res.json(module.name);
  };


  export default function WorkingWithObjects(app) {

    const getAssignment = (req, res) => {
      res.json(assignment);
    };

    const getModule = (req, res) => {
        res.json(module);
    };
    app.get("/lab5/assignment", getAssignment);
    app.get("/lab5/assignment/title", getAssignmentTitle);
    app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);

    app.get("/lab5/assignment/completed/:completed", setAssignmentCompleted);
    app.get("/lab5/assignment/score/:score", setAssignmentScore);

    app.get("/lab5/module", getModule);
    app.get("/lab5/module/name", getModuleName);
    app.get("/lab5/module/name/:newName", setModuleName);

  };
  