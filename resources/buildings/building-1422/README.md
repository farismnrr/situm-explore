# Building 1422 local floorplan resources

This folder uses `building-1422` as a local resource slug only. Situm discovery confirmed the corresponding building as `19866` (`PT Berjaya Inovasi Global`).

## Situm discovery

The accessible Situm account returned building `19866`, named `PT Berjaya Inovasi Global`. Its floors are:

| Local mapping | Situm floor ID | Situm name |
| --- | ---: | --- |
| `source/floor-1.jpeg` | `69904` | `lt 1` |
| `source/floor-2.jpeg` | `69905` | `lt 2` |

The floor names confirm the filename-based floor mapping. The floor response did not expose an attached map/floorplan field in the inspected metadata; local JPEGs remain reference assets pending any deeper cartography comparison.

## Files

| Original source | Normalized repository file | Dimensions | File size | Orientation | SHA-256 |
| --- | --- | ---: | ---: | --- | --- |
| `/home/farismnrr/Downloads/lt 1-1422.jpeg` | `source/floor-1.jpeg` | 1422 × 529 px | 71,044 B | JPEG orientation undefined; displayed landscape with no observed rotation required | `e82328a0c24f93ddfb8996c94581d8ae5e8e5acacffd9d7f7f5f97c6dc0b9aeb` |
| `/home/farismnrr/Downloads/lt 2-1422.jpeg` | `source/floor-2.jpeg` | 1422 × 529 px | 59,233 B | JPEG orientation undefined; displayed landscape with no observed rotation required | `c6d85dd06a96461df4d19c17a6ab12fd78f342f4613d43dc60f08b354133bfa3` |

The source files were copied, not moved. Matching SHA-256 values confirm that intake did not recompress or resize them. The original files remain in `/home/farismnrr/Downloads/`.

The mapping from the normalized files to floors 1 and 2 is confirmed by the Situm floor names and IDs above. Visual inspection shows architectural floorplan drawings, including stair and workspace labels, and no rotation is indicated by the image metadata or rendered orientation.

Canonical status is pending: Situm building/floor metadata is confirmed, but the local JPEG bytes have not been compared with Situm-hosted cartography or floorplan imagery.
