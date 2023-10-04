# Data Formats

Since there are quite a few moving pieces of data within this project, it's prudent to go ahead and document every single one of them, and how they are used.

## Student Import

The student import file is used (for now during startup) to import a CSV of users into the database.

This file should be located within the `storage` directory at the root of the repository, and titled `students.csv`.

This file, if found will be used to import a set of users directly into the database.

The delimiter used within this file can be set via the `app.yaml` configuration file with `CSV_DELIMITER`. By default this is `,`.

The columns of this CSV should be:

* `student_id`
* `first_name`
* `last_name`

An example of this data should look like so:

```csv
student_id, first_name, last_name
1, John, Smith
2, Jane, Smith
```

## Points Presets

To help your users avoid having to type out the same reason and point amount over and over, you are able to provide presets for this data, both for adding and removing points.

The file used to define these presets should be located within the `storage` directory, and titled `point_presets.yaml`.

This file, if found will be used to build the presets visible on this page.

An example of this file should look like so:

```yaml
add:
  - name: "Good Behavior"
    amount: 10
remove:
  - name: "Bad Behavior"
    amount: 10
    reason: "Disrupting Class"
```

As you can see the root objects of `add` and `remove` are used to define the presets for adding and removing points respectively.

Within each item's array are objects with the following properties:

* `name`: This is the name that will appear for the preset.
* `amount`: This is the amount of points that will be modified when selecting the preset.
* `reason`: This optional value is what will appear in the `reason` field during point modification. Omitting this value will use the `name` instead as the reason.
