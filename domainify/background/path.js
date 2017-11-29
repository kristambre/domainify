function Path(path, splitter, next) {
    path = path.endsWith(splitter) ? path.substr(0, path.length - 1) : path;
    this.value = path;
    this.up = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter)), splitter, this) : this;
    this.down = next == null ? this : next;
}