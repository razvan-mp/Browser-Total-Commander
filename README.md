# Browser Total Commander
Python (Django) server with an Angular front end created for the [Python Programming Course](https://sites.google.com/site/fiipythonprogramming),
designed to provide a good-looking web UI for interacting with your file system, in the style of Total Commander or similar software (Far Manager, Double Commander, fman and others).

It supports multiple file system operations, such as:
- Navigation through disk partitions
- Creation of new files/folders
- Safe copy/move of files/folder trees (no overwrites, copies will be automatically renamed)
- File renaming (with support for selecting multiple files for rename)
- Editing text files
- Changing current working directories via absolute paths
- Deleting files/folders


## Prerequisites
To run this app, you will need:
- Python _version 3.x_
- Angular CLI _latest should work_

Before the first run you must execute the following commands in your terminal:
```
pip install django djangorestframework django-cors-headers
```
and for the front end (while in the _front-end_ folder):
```
npm install
```
