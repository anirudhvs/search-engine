package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"runtime"
	"strings"
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

const (
	ALBHABET_SIZE = 26
)

type trieNode struct {
	childrens [ALBHABET_SIZE]*trieNode
	isWordEnd bool
}

type trie struct {
	root *trieNode
}

func initTrie() *trie {
	return &trie{
		root: &trieNode{},
	}
}

func PrintMemUsage() {
        var m runtime.MemStats
        runtime.ReadMemStats(&m)
        // For info on each, see: https://golang.org/pkg/runtime/#MemStats
        fmt.Printf("Alloc = %v MiB", bToMb(m.Alloc))
        fmt.Printf("\tTotalAlloc = %v MiB", bToMb(m.TotalAlloc))
        fmt.Printf("\tSys = %v MiB", bToMb(m.Sys))
        fmt.Printf("\tNumGC = %v\n", m.NumGC)
}

func bToMb(b uint64) uint64 {
    return b / 1024 / 1024
}

func (t *trie) insert(word string) {
	wordLength := len(word)
	current := t.root
	for i := 0; i < wordLength; i++ {
		index := word[i] - 'a'
		if current.childrens[index] == nil {
			current.childrens[index] = &trieNode{}
		}
		current = current.childrens[index]
	}
	current.isWordEnd = true
}

func (t *trie) find(word string) bool {
	wordLength := len(word)
	current := t.root
	for i := 0; i < wordLength; i++ {
		index := word[i] - 'a'
		if current.childrens[index] == nil {
			return false
		}
		current = current.childrens[index]
	}
	if current.isWordEnd {
		return true
	}
	return false
}

func main() {
	jsonFile, err := os.Open("../site_data.json")
	if err != nil {
		fmt.Println(err)
	}

	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var sites []Site
	json.Unmarshal(byteValue, &sites)

	trie := initTrie()
//	no_of_words, err := strconv.Atoi(os.Args[1])
	PrintMemUsage()
	for i := 0; i < len(sites); i++ {
		sentence := strings.Split(sites[i].Body, " ")
		for j := 0; j < len(sentence); j++ {
			sentence[j] = strings.ToLower(sentence[j])
			matched, _ := regexp.MatchString(`^[a-z]*$`, sentence[j])
			// fmt.Println(matched, sentence[j])
			// t1 := time.Now()
			if matched {
				trie.insert(sentence[j])
			}
			// t2 := time.Now()
			// elapsed := t2.Sub(t1)
			// sum += elapsed
		}
	}
	runtime.GC()
	PrintMemUsage()

//	t1 := time.Now()

//	k = 0
//	fl = 0
//	for i := 0; i < len(sites); i++ {
//		sentence := strings.Split(sites[i].Body, " ")
//		for j := 0; j < len(sentence); j++ {
//			sentence[j] = strings.ToLower(sentence[j])
//			matched, _ := regexp.MatchString(`^[a-z]*$`, sentence[j])

//			if matched {
//				t1 := time.Now()
//				trie.find(sentence[j])
//				t2 := time.Now()
//				elapsed := t2.Sub(t1)
//				sum += elapsed
//				k++
//				if k >= no_of_words {
//					fl = 1
//					break
//				}
//			}
//		}
//		if fl == 1 {
//			break
//		}
//	}
//	fmt.Println(sum)
	//	t2 := time.Now()
	//	fmt.Println(elapsed)
}
