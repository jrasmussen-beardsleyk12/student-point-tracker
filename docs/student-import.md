# Student Import

Student Import is an important aspect of getting data into the system, although if the prebuilt system of importing students doesn't suite you, it can always be replaced.

## Configuration

Most importantly to begin, you must add the `CONFIGURATION` values relevant to the student import file:

* `CSV_DELIMITER`: This is the delimiter character used in your CSV. (e.g. `","`)
* `COLUMNS`: This is hwo to define the columns of your file to `csv-parse`. Full options [here](https://csv.js.org/parse/options/columns/)
  - If the columns are defined at the top of the file `true` is all that's needed.
  - Otherwise if they are not, it's recommended to add an array of the columns in order.

## Triggering the Import

Currently the recommended way to trigger an import of students is via a [`task`](./tasks.md).

For example if your file is located at `./storage/students.csv` your task entry would look like:

```yaml
TASKS:
  - name: "Import students on startup"
    schedule: startup
    action: importUsers
    file: "./storage/students.csv"
```

---

Although, if this system doesn't have the flexibility needed creating a generic task and calling the right import APIs manually.
