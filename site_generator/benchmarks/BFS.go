package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"time"
)

type Site struct {
	Title      string   `json:"title"`
	Body       string   `json:"body"`
	Links      []int    `json:"links"`
	ParentSite string   `json:"parent_site"`
	SiteURL    string   `json:"site_url"`
	LinkURL    []string `json:"link_urls"`
	Slug       string   `json:"slug"`
}

func main() {
	// fmt.Println("Hello, World!")
	jsonFile, err := os.Open("../site_data.json")
	if err != nil {
		fmt.Println(err)
	}
	// fmt.Println("opened jsonfile")

	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var sites []Site
	json.Unmarshal(byteValue, &sites)

	var visited [1000000]int
	t1 := time.Now()
	for i := 0; i < len(sites); i++ {
		if visited[i] == 0 {
			queue := []int{i}
			queueBeg := 0
			for queueBeg < len(queue) {

				for size := len(queue) - queueBeg; size > 0; size-- {
					front := queue[queueBeg]
					queueBeg++
					if visited[front] == 1 {
						continue
					}
					visited[front] = 1
					// fmt.Println("visiting", front)
					for j := 0; j < len(sites[front].Links); j++ {
						queue = append(queue, sites[front].Links[j])
					}
				}
			}
		}
	}
	t2 := time.Now()
	elapsed := t2.Sub(t1)
	fmt.Println(elapsed)
}
