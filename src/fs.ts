import { count, details, detailsAll } from "./util.ts";

/** Metrics related to the filesystem. */
export interface FilesystemMetrics {
  /** The count of currently open files. */
  openFiles: number;
  /** The amount of files that are in the process of being opened. */
  filesOpening: number;
  /** The amount of files that have been opened. */
  filesOpened: number;

  /** The amount of directories that are in the process of being created. This
   * includes temporary directories. */
  directoriesCreating: number;
  /** The amount of times a directory was created. This includes temporary
   * directories. */
  directoriesCreated: number;
  /** The amount of times a directory was listed. */
  directoryListings: number;

  /** The amount of currently ongoing a file/directory remove operations. */
  removing: number;
  /** The amount of times a file/directory was removed. */
  removed: number;
  /** The amount of currently ongoing a file/directory rename operations. */
  renaming: number;
  /** The amount of times a file/directory was renamed. */
  renamed: number;
  /** The amount of currently ongoing a file/directory stat operations. */
  stating: number;
  /** The amount of times stat was called on a file/directory. */
  stated: number;

  /** The amount of open fs watchers. */
  openWatchers: number;
  /** The amount of fs watchers opened. */
  watchersOpened: number;
  /** The amount of fs watcher events that have been received. */
  watcherEventsReceived: number;

  /** The amount of files currently being copied. */
  filesCopying: number;
  /** The amount of files copied. */
  filesCopied: number;
}

export function metrics(
  resourceNames: string[],
  ops: Record<string, Deno.OpMetrics>,
): FilesystemMetrics {
  const [filesOpening, filesOpened] = detailsAll(ops, "os_open");

  const [directoriesCreating, directoriesCreated] = detailsAll(ops, "op_mkdir");
  const [tmpDirectoriesCreating, tmpDirectoriesCreated] = detailsAll(
    ops,
    "op_make_temp_dir",
  );
  const [, directoryListings] = detailsAll(ops, "op_read_dir");

  const [removing, removed] = detailsAll(ops, "op_remove");
  const [renaming, renamed] = detailsAll(ops, "op_rename");
  const [stating, stated] = detailsAll(ops, "op_stat");

  const [, watchersOpened] = details(ops, "op_fs_events_open");
  const [, watcherEventsReceived] = details(ops, "op_fs_events_poll");

  const [filesCopying, filesCopied] = detailsAll(ops, "op_copy_file");

  return {
    openFiles: count(resourceNames, "fsFile"),
    filesOpening,
    filesOpened,

    directoriesCreating: directoriesCreating + tmpDirectoriesCreating,
    directoriesCreated: directoriesCreated + tmpDirectoriesCreated,
    directoryListings,

    removing,
    removed,
    renaming,
    renamed,
    stating,
    stated,

    openWatchers: count(resourceNames, "fsEvents"),
    watchersOpened,
    watcherEventsReceived,

    filesCopying,
    filesCopied,
  };
}
