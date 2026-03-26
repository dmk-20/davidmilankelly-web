# Session plan

do the following:

- restructure codebase, use conventional folder heirarchies of src, docs, public, etc... (update references elsewhere). Also rename public files for how they are being used. use context clues.
- update index.html to use react and move the contents of index.html to a massive component.
- after validating, split index.html's new component into reusable pieces, but ABSOLUTELY DO NOT deviate from index.html's design. The DOM after react refactoring should be nearly identical and visually it should definitely be identical. 
- after refactoring we are going to compress and reduce the size of all video files preserving quality and file format. We are then going to produce a video version of "blur placeholder" where we are going to load an even smaller version of the video while the other video buffers. The goal is to not have the video appear "missing" "blank" "lagging" "broken" "jittery" or otherwise. This is an accepted pattern, but when we get to this step please present me with advanced options that do not include skeletons or uploading them to a streaming service, or buffering them.