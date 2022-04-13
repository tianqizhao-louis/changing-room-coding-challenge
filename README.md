# Coding Challenge for Changing Room

## Requirements

Instructions:
 
- Build a basic flask web app that serves the purpose of a to-do list.
- You should be able to add tasks, that would be displayed on the page
- Remove or complete them with a checkbox that would remove them from the page
- Each task should have two fields, a title and a deadline

Optional to stand out:

- Make the tasks ordered by deadline
- Add the option to edit a task title or deadline
- Other small functionalities that you believe could help (resetting everything or others)

Comments:

- Submit your code with a readme and a requirements.txt
- In your readme, specify how to run your code, and explain it
- Select how to store your data (file or else)

## Implemented Features

- [x] To-Do list that the user can add, delete, or update task name and deadline
- [x] Task ordered by deadline
- [x] Responsive Design
- [x] Send Ajax calls using Fetch API, rather than refreshing the whole page for any updates
- [x] Employ a CSS Framework called Bulma
- [x] Using SQLite3 as Backend Database

## Run the Program

How to run the code:

```bash
cd src
python3 -m venv env 
source env/bin/activate
pip install -r requirements.txt
flask run
```
