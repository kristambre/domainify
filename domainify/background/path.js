function Path(path, splitter, next) {
    this.value = path;
    this.up = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter)), splitter, this) : this;
    this.down = next == null ? this : next;
}