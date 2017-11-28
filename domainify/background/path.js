function Path(path, splitter, next) {
    this.current = path;
    this.up = path.length > 0 ? new Path(path.substr(0, path.lastIndexOf(splitter)), splitter, this) : this;
    this.down = next == null ? this : next;
    this.splitter = splitter;

    this.getString = function () {
        let conc = this.current.endsWith(splitter) ? "" : this.splitter;
        return this.current.concat(conc);
    }
}