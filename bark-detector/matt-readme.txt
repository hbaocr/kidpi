silence [-l] above-periods [duration
threshold[d|%] [below-periods duration threshold[d|%]]


Above Periods: 1
Duration: .1 seconds
Bottom Threshold: 2%

Below periods: 1
Duration: .1 seconds
Top Threshold: 100 percent
rec mattpiece.wav sinc 120-2k silence 1 0.1 2% 1 .1 100% : newfile : restart -V4
