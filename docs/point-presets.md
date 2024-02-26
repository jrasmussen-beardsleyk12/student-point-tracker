# Point Presets

If you commonly are added or subtracting the same amount of points with the same reason, such as being late to class or turning in homework, it'd be best to create a Point Preset file to avoid repetitive typing.

Creating a file title `point_presets.yaml` and placing it in SPT's default data directory will allow this file to be automatically picked up. *Changes to the Point Presets file should be visible immediately*

Within the file you'll need to use the two top level keys:

  * `add`: This is for an array of presets for adding points.
  * `remove`: This is for an array of presets for removing points.

Within these keys is an array of objects with two properties:

  * `name`: The human friendly name of the preset. This name is also what's used to fill out the "Reason" field.
  * `amount`: An integer amount of points to modify.

So if you wanted to make a Point Preset file for removing 1 point whenever a student is late, and reward 2 points if they clean up the classroom, it'd look like so:

> `point_presets.yaml`

```yaml
add:
  - name: "Cleaned up Classroom"
    amount: 2
remove:
  - name: "Late to Class"
    amount: 1
```
