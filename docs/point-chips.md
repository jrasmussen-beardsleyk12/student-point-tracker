# Point Chips

If there are common values of points frequently added, those values can be added to the Quick Point Chips configuration option to ensure these select values can be quickly clicked on for convenience.

To configure your Quick Point Chips simply modify the `POINT_CHIPS` configuration option in your [`app.yaml` file](./configuration.md).

For example if you wanted to be able to quickly use the values: `25`, `50`, and `100` you could add:

```yaml
POINT_CHIPS:
  - 25
  - 50
  - 100
```
