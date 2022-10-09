class Timer {
    constructor(startTime = 0, descending = false) {
        this.time = startTime * 1000;
        this.startSeconds = startTime * 1000;
        this.descending = descending;
        this.diffTimestamp = 0;
        this.on = false;
    }
    update() {
        if (this.on) {
            var diff = new Date().getTime() - this.diffTimestamp;
            this.time += this.descending ? -diff : diff;
            if (this.time <= 0) {
                this.on = false;
                this.time = 0;
            }
            this.diffTimestamp = new Date().getTime();
        }
    }
    toggleStart() {
        this.on = !this.on;
        if (this.on) this.diffTimestamp = new Date().getTime();
    }
    reset() {
        this.time = this.startSeconds;
        this.on = false;
    }
    setStartSeconds(val, descending) {
        this.startSeconds = val * 1000;
        this.time = val * 1000;
        this.descending = descending;
        this.on = false;
    }
    toString() {
        var seconds = Math.floor(this.time / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);

        var hoursStr = hours > 0 ? hours + ":" : "";
        var minutesStr = minutes > 0 ? ("00" + (minutes % 60)).slice(-2) + ":" : "";
        var secondsStr = ("00" + (seconds % 60)).slice(-2);

        return hoursStr + minutesStr + secondsStr;
    }
}